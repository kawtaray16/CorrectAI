const textInput = document.getElementById("textInput");

const languageSelect =
    document.getElementById("languageSelect");

const correctButton =
    document.getElementById("correctButton");

const clearButton =
    document.getElementById("clearButton");

const copyButton =
    document.getElementById("copyButton");

const resultText =
    document.getElementById("resultText");

const wordCount =
    document.getElementById("wordCount");

const characterCount =
    document.getElementById("characterCount");

const statWords =
    document.getElementById("statWords");

const statCharacters =
    document.getElementById("statCharacters");

const statErrors =
    document.getElementById("statErrors");

const resultLanguage =
    document.getElementById("resultLanguage");

const correctionStatus =
    document.getElementById("correctionStatus");

const inputStatus =
    document.getElementById("inputStatus");

const correctionsSection =
    document.getElementById("correctionsSection");

const correctionsList =
    document.getElementById("correctionsList");

const correctionCount =
    document.getElementById("correctionCount");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


let currentCorrectedText = "";


/* =========================
   UTILITAIRES
========================= */


function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


function countWords(text) {

    if (!text.trim()) {
        return 0;
    }

    return text
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;
}


function updateStatistics() {

    const text = textInput.value;

    const words = countWords(text);

    const characters = text.length;

    wordCount.textContent =
        `${words} ${words === 1 ? "mot" : "mots"}`;

    characterCount.textContent =
        `${characters} caractère${characters === 1 ? "" : "s"}`;

    statWords.textContent = words;

    statCharacters.textContent = characters;
}


/* =========================
   SAISIE
========================= */


textInput.addEventListener(
    "input",
    updateStatistics
);


/* =========================
   CORRECTION
========================= */


async function correctText() {

    const text = textInput.value.trim();

    if (!text) {

        showToast(
            "Veuillez saisir un texte à corriger."
        );

        textInput.focus();

        return;
    }


    correctButton.disabled = true;

    inputStatus.textContent = "Analyse...";

    correctionStatus.textContent =
        "Analyse en cours...";


    resultText.innerHTML = `

        <div class="empty-result">

            <div class="empty-icon">
                ⟳
            </div>

            <h3>
                Analyse du texte...
            </h3>

            <p>
                Recherche des erreurs d'orthographe,
                de grammaire et de ponctuation.
            </p>

        </div>

    `;


    try {

        const response = await fetch(
            "/api/correct",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    text: text,

                    language:
                        languageSelect.value

                })

            }
        );


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "Erreur de correction."
            );

        }


        currentCorrectedText =
            data.corrected;


        displayResult(data);


        displayCorrections(
            data.corrections
        );


        statErrors.textContent =
            data.statistics.errors;


        inputStatus.textContent =
            "Analyse terminée";


    }

    catch (error) {

        console.error(error);

        resultText.innerHTML = `

            <div class="empty-result">

                <div class="empty-icon">
                    !
                </div>

                <h3>
                    Correction impossible
                </h3>

                <p>
                    ${escapeHtml(error.message)}
                </p>

            </div>

        `;

        inputStatus.textContent =
            "Erreur";

        correctionStatus.textContent =
            "Échec de la correction";

        showToast(error.message);

    }

    finally {

        correctButton.disabled = false;

    }

}


/* =========================
   AFFICHAGE RESULTAT
========================= */


function displayResult(data) {

    resultText.textContent =
        data.corrected;


    resultLanguage.textContent =
        data.languageName;


    const errors =
        data.statistics.errors;


    if (errors === 0) {

        correctionStatus.textContent =
            "✓ Aucun problème détecté";

    }

    else {

        correctionStatus.textContent =
            `${errors} correction${errors > 1 ? "s" : ""} détectée${errors > 1 ? "s" : ""}`;

    }

}


/* =========================
   DETAILS CORRECTIONS
========================= */


function displayCorrections(corrections) {

    correctionsList.innerHTML = "";


    if (!corrections.length) {

        correctionsSection.classList.remove(
            "hidden"
        );

        correctionCount.textContent =
            "Texte correct";


        correctionsList.innerHTML = `

            <div class="correction-item">

                <div class="correction-number">
                    ✓
                </div>

                <div>

                    <div class="correction-message">
                        Aucune erreur détectée
                    </div>

                    <div style="
                        color:#777b8a;
                        font-size:12px;
                    ">
                        Votre texte ne contient aucune
                        correction détectée par le moteur.
                    </div>

                </div>

            </div>

        `;

        return;
    }


    correctionsSection.classList.remove(
        "hidden"
    );


    correctionCount.textContent =
        `${corrections.length} correction${corrections.length > 1 ? "s" : ""}`;


    corrections.forEach(
        (correction, index) => {

            const item =
                document.createElement("div");

            item.className =
                "correction-item";


            const suggestions =
                correction.suggestions || [];


            let suggestionsHtml = "";


            if (suggestions.length) {

                suggestionsHtml = `

                    <div class="correction-suggestions">

                        ${suggestions.map(
                            suggestion => `
                                <span class="suggestion">
                                    ${escapeHtml(suggestion)}
                                </span>
                            `
                        ).join("")}

                    </div>

                `;

            }


            item.innerHTML = `

                <div class="correction-number">
                    ${index + 1}
                </div>

                <div>

                    <div class="correction-message">
                        ${escapeHtml(
                            correction.message
                        )}
                    </div>

                    ${suggestionsHtml}

                </div>

            `;


            correctionsList.appendChild(item);

        }
    );

}


/* =========================
   COPIER
========================= */


copyButton.addEventListener(
    "click",
    async () => {

        if (!currentCorrectedText) {

            showToast(
                "Aucun texte corrigé à copier."
            );

            return;
        }


        try {

            await navigator.clipboard.writeText(
                currentCorrectedText
            );

            copyButton.textContent =
                "✓ Copié";

            showToast(
                "Texte corrigé copié."
            );


            setTimeout(() => {

                copyButton.textContent =
                    "Copier";

            }, 2000);

        }

        catch {

            showToast(
                "Impossible de copier le texte."
            );

        }

    }
);


/* =========================
   EFFACER
========================= */


clearButton.addEventListener(
    "click",
    () => {

        textInput.value = "";

        currentCorrectedText = "";

        updateStatistics();


        resultText.innerHTML = `

            <div class="empty-result">

                <div class="empty-icon">
                    ✦
                </div>

                <h3>
                    Votre texte corrigé apparaîtra ici
                </h3>

                <p>
                    Saisissez votre texte puis cliquez
                    sur « Corriger le texte ».
                </p>

            </div>

        `;


        statErrors.textContent = "0";

        resultLanguage.textContent = "—";

        correctionStatus.textContent =
            "Aucune correction";

        inputStatus.textContent =
            "Prêt";


        correctionsSection.classList.add(
            "hidden"
        );

    }
);


/* =========================
   LANGUES
========================= */


document
    .querySelectorAll(
        ".header-lang-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".header-lang-btn"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                const language =
                    button.dataset
                        .interfaceLanguage;


                if (language === "ar") {

                    document.body.classList.add(
                        "rtl"
                    );

                }

                else {

                    document.body.classList.remove(
                        "rtl"
                    );

                }

            }
        );

    });


/* =========================
   BOUTON CORRIGER
========================= */


correctButton.addEventListener(
    "click",
    correctText
);


/* =========================
   RACCOURCI CTRL + ENTER
========================= */


textInput.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            correctText();

        }

    }
);


/* =========================
   SECURITE HTML
========================= */


function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/* =========================
   INITIALISATION
========================= */


updateStatistics();