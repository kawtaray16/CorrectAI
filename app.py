from flask import Flask, render_template, request, jsonify
import requests
import re

app = Flask(__name__)

LANGUAGETOOL_URL = "https://api.languagetool.org/v2/check"

LANGUAGES = {
    "fr": {
        "api": "fr",
        "name": "Français"
    },
    "en": {
        "api": "en-US",
        "name": "English"
    },
    "ar": {
        "api": "ar",
        "name": "العربية"
    }
}


def detect_language(text):
    """
    Détection simple de la langue.
    La détection automatique peut être améliorée ultérieurement
    avec un modèle NLP dédié.
    """

    if not text.strip():
        return "fr"

    arabic_chars = len(
        re.findall(r"[\u0600-\u06FF]", text)
    )

    latin_chars = len(
        re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ]", text)
    )

    if arabic_chars > latin_chars:
        return "ar"

    # Quelques mots indicateurs
    text_lower = text.lower()

    french_words = [
        "bonjour",
        "avec",
        "pour",
        "dans",
        "une",
        "des",
        "les",
        "être",
        "avoir",
        "nous",
        "vous",
        "mais",
        "merci"
    ]

    english_words = [
        "hello",
        "with",
        "for",
        "the",
        "this",
        "that",
        "have",
        "has",
        "are",
        "you",
        "thank",
        "please"
    ]

    french_score = sum(
        1 for word in french_words
        if re.search(r"\b" + re.escape(word) + r"\b", text_lower)
    )

    english_score = sum(
        1 for word in english_words
        if re.search(r"\b" + re.escape(word) + r"\b", text_lower)
    )

    if english_score > french_score:
        return "en"

    return "fr"


def apply_corrections(text, matches):
    """
    Applique les meilleures suggestions retournées par LanguageTool.
    On traite les erreurs de la fin vers le début afin de conserver
    les positions originales.
    """

    corrected = text

    valid_matches = []

    for match in matches:
        replacements = match.get("replacements", [])

        if not replacements:
            continue

        replacement = replacements[0].get("value")

        if replacement is None:
            continue

        valid_matches.append({
            "offset": match.get("offset", 0),
            "length": match.get("length", 0),
            "replacement": replacement
        })

    valid_matches.sort(
        key=lambda item: item["offset"],
        reverse=True
    )

    for item in valid_matches:
        start = item["offset"]
        end = start + item["length"]

        corrected = (
            corrected[:start]
            + item["replacement"]
            + corrected[end:]
        )

    return corrected


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/correct", methods=["POST"])
def correct_text():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "Données invalides."
            }), 400

        text = data.get("text", "").strip()
        language = data.get("language", "auto")

        if not text:
            return jsonify({
                "success": False,
                "error": "Veuillez saisir un texte."
            }), 400

        if len(text) > 60000:
            return jsonify({
                "success": False,
                "error": "Le texte ne doit pas dépasser 60 000 caractères."
            }), 400

        # Détection automatique
        if language == "auto":
            language = detect_language(text)

        if language not in LANGUAGES:
            return jsonify({
                "success": False,
                "error": "Langue non supportée."
            }), 400

        api_language = LANGUAGES[language]["api"]

        payload = {
            "text": text,
            "language": api_language,
            "enabledOnly": "false"
        }

        response = requests.post(
            LANGUAGETOOL_URL,
            data=payload,
            timeout=30
        )

        if response.status_code != 200:
            return jsonify({
                "success": False,
                "error": "Le service de correction est temporairement indisponible."
            }), 503

        result = response.json()

        matches = result.get("matches", [])

        corrected_text = apply_corrections(
            text,
            matches
        )

        corrections = []

        for match in matches:

            replacements = match.get(
                "replacements",
                []
            )

            suggestions = [
                item.get("value")
                for item in replacements[:5]
                if item.get("value")
            ]

            corrections.append({
                "message": match.get(
                    "message",
                    "Erreur détectée."
                ),
                "shortMessage": match.get(
                    "shortMessage",
                    ""
                ),
                "offset": match.get(
                    "offset",
                    0
                ),
                "length": match.get(
                    "length",
                    0
                ),
                "context": match.get(
                    "context",
                    {}
                ),
                "suggestions": suggestions,
                "rule": match.get(
                    "rule",
                    {}
                ).get(
                    "id",
                    ""
                )
            })

        words = len(
            re.findall(
                r"\b[\wÀ-ÿ\u0600-\u06FF'-]+\b",
                text,
                flags=re.UNICODE
            )
        )

        characters = len(text)

        return jsonify({
            "success": True,
            "language": language,
            "languageName": LANGUAGES[language]["name"],
            "original": text,
            "corrected": corrected_text,
            "corrections": corrections,
            "statistics": {
                "words": words,
                "characters": characters,
                "errors": len(corrections)
            }
        })

    except requests.exceptions.Timeout:

        return jsonify({
            "success": False,
            "error": "Le service de correction met trop de temps à répondre."
        }), 504

    except requests.exceptions.RequestException:

        return jsonify({
            "success": False,
            "error": "Impossible de contacter le service de correction."
        }), 503

    except Exception as error:

        print("Erreur :", error)

        return jsonify({
            "success": False,
            "error": "Une erreur interne est survenue."
        }), 500


@app.route("/api/health")
def health():

    return jsonify({
        "status": "ok",
        "application": "CorrectAI"
    })


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )