# ✦ CorrectAI

### Intelligent Multilingual Writing Assistant

CorrectAI est une application web de correction intelligente permettant d'analyser et de corriger des textes en **français, arabe et anglais**.

L'application détecte les erreurs d'orthographe, de grammaire et de ponctuation, puis propose des corrections adaptées à la langue sélectionnée.

---

## 🌍 Fonctionnalités

* 🇫🇷 Correction en français
* 🇩🇿 Correction en arabe
* 🇬🇧 Correction en anglais
* 🌐 Détection automatique de la langue
* ✍️ Correction orthographique
* 📝 Détection d'erreurs grammaticales
* 🔤 Vérification de la ponctuation
* 💡 Suggestions de correction
* 📊 Statistiques du texte
* 📋 Copie du texte corrigé
* 🗑️ Effacement du texte
* ⚡ Analyse rapide
* 📱 Interface responsive
* ↔️ Support de l'écriture arabe RTL
* 🎨 Interface moderne et professionnelle

---

## 🖥️ Aperçu

L'application propose une interface composée de :

* une zone de saisie du texte ;
* une sélection de langue ;
* une zone affichant le texte corrigé ;
* des statistiques ;
* une liste détaillée des corrections détectées.

---

## 🛠️ Technologies utilisées

### Backend

* Python
* Flask
* Requests

### Frontend

* HTML5
* CSS3
* JavaScript
* Responsive Design

### Intelligence linguistique

* LanguageTool API
* Traitement automatique du langage naturel (NLP)
* Détection multilingue

---

## 📁 Structure du projet

```text
CorrectAI/
│
├── app.py
├── requirements.txt
├── README.md
│
├── templates/
│   └── index.html
│
└── static/
    ├── css/
    │   └── style.css
    │
    └── js/
        └── script.js
```

---

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/kawtaray16/CorrectAI.git
```

### 2. Entrer dans le projet

```bash
cd CorrectAI
```

### 3. Créer un environnement virtuel

Windows :

```bash
python -m venv venv
```

### 4. Activer l'environnement virtuel

PowerShell :

```powershell
venv\Scripts\Activate.ps1
```

CMD :

```cmd
venv\Scripts\activate
```

### 5. Installer les dépendances

```bash
pip install -r requirements.txt
```

---

## ▶️ Lancer l'application

Exécuter :

```bash
python app.py
```

Puis ouvrir dans le navigateur :

```text
http://127.0.0.1:5000
```

---

## 🔎 Fonctionnement

Le fonctionnement général de CorrectAI est le suivant :

```text
Utilisateur
     │
     ▼
Saisie du texte
     │
     ▼
Sélection de la langue
     │
     ▼
Détection automatique
     │
     ▼
Analyse linguistique
     │
     ▼
LanguageTool
     │
     ├── Orthographe
     ├── Grammaire
     └── Ponctuation
     │
     ▼
Suggestions
     │
     ▼
Texte corrigé
```

---

## 🌐 Langues supportées

| Langue   | Code    |
| -------- | ------- |
| Français | `fr`    |
| العربية  | `ar`    |
| English  | `en-US` |

La détection automatique permet également de sélectionner automatiquement une langue avant l'analyse.

---

## 📊 Statistiques

Après l'analyse, CorrectAI affiche :

* nombre de mots ;
* nombre de caractères ;
* nombre d'erreurs détectées ;
* nombre de corrections proposées.

---

## 🎨 Interface

L'application utilise une interface moderne basée sur :

* cartes avec coins arrondis ;
* palette violette professionnelle ;
* espaces blancs ;
* boutons interactifs ;
* design responsive ;
* support RTL pour l'arabe.

---

## 🔐 Sécurité

Le projet ne nécessite pas de compte utilisateur pour fonctionner.

Les textes sont envoyés au service de correction utilisé par l'application pour effectuer l'analyse linguistique.

Pour une utilisation commerciale ou à grande échelle, il est recommandé de mettre en place une infrastructure de correction adaptée et de définir une politique de confidentialité.

---

## 🚀 Améliorations futures

Plusieurs fonctionnalités peuvent être ajoutées :

* correction avancée basée sur des modèles d'IA ;
* reformulation automatique ;
* amélioration du style ;
* résumé de texte ;
* traduction ;
* détection du ton ;
* historique des corrections ;
* comptes utilisateurs ;
* export PDF ;
* import de fichiers `.txt`, `.docx` et `.pdf` ;
* mode sombre ;
* application mobile ;
* modèle NLP spécialisé pour l'arabe ;
* déploiement cloud.

---

## 👩‍💻 Auteur

**Kaouthar LARDJANE**

GitHub :
https://github.com/kawtaray16

LinkedIn :
[www.linkedin.com/in/kaouthar-lardjane-569730400](http://www.linkedin.com/in/kaouthar-lardjane-569730400)

---

## 📄 Licence

Ce projet est développé à des fins éducatives, professionnelles et de portfolio.

---

## ⭐ Projet

Si ce projet vous intéresse, vous pouvez lui attribuer une étoile sur GitHub.

**CorrectAI — Write better. Write with confidence.**
