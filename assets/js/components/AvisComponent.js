/* ==========================================================================
   COMPOSANT FORMULAIRE D'AVIS (<avis-form>)
   ========================================================================== */
class AvisForm extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    // Affichage des messages d'erreur ou de succès
    showError(messages) {
        const status = this.querySelector('#status-message');
        status.className = "status-message error";
        status.innerHTML = Array.isArray(messages) ? messages.join("<br>") : messages;
        status.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    showSuccess(message) {
        const status = this.querySelector('#status-message');
        status.className = "status-message success";
        status.textContent = message;
        status.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Structure HTML du formulaire
    render() {
        this.innerHTML = `
            <form id="form-avis" novalidate style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div id="status-message" aria-live="polite" style="margin-bottom: 1rem; font-weight: bold;"></div>

                <div class="form-group">
                    <label for="nom" style="display:block; margin-bottom: 5px;">Nom *</label>
                    <input type="text" id="nom" name="nom" required style="width:100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px;">
                </div>

                <div class="form-group">
                    <label for="prenom" style="display:block; margin-bottom: 5px;">Prénom *</label>
                    <input type="text" id="prenom" name="prenom" required style="width:100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px;">
                </div>

                <div class="form-group">
                    <label for="email" style="display:block; margin-bottom: 5px;">Email *</label>
                    <input type="email" id="email" name="email" required style="width:100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px;">
                </div>

                <div class="form-group">
                    <label for="ville" style="display:block; margin-bottom: 5px;">Ville *</label>
                    <input type="text" id="ville" name="ville" required style="width:100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px;">
                </div>

                <div class="form-group">
                    <label for="note" style="display:block; margin-bottom: 5px;">Note (1 à 5) *</label>
                    <select id="note" name="note" required style="width:100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px;">
                        <option value="">Choisissez une note</option>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Très bien</option>
                        <option value="3">3 - Moyen</option>
                        <option value="2">2 - Décevant</option>
                        <option value="1">1 - À éviter</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="avis" style="display:block; margin-bottom: 5px;">Votre avis *</label>
                    <textarea id="avis" name="avis" rows="4" required style="width:100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px;"></textarea>
                </div>

                <button type="submit" class="btn-primary" style="cursor:pointer; border:none; width: fit-content;">Ajouter mon avis</button>
            </form>
        `;

        this.querySelector('#form-avis').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Traitement de la soumission et validation
    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        let errors = [];
        if (!data.nom || !data.prenom || !data.ville || !data.avis || !data.note) {
            errors.push("Tous les champs marqués d'une étoile (*) sont obligatoires.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push("Veuillez entrer une adresse email valide.");
        }

        if (errors.length > 0) {
            this.showError(errors);
            return;
        }

        // Envoi des données vers le fichier JSON (Nécessite un backend en production)
        try {
            const response = await fetch('assets/data/avis.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok || response.status === 405) {
                this.showSuccess("🎉 Merci ! Votre avis a été envoyé avec succès.");
                form.reset();
                // Rafraîchissement de la liste
                document.querySelector('avis-list').loadAvis();
            } else {
                throw new Error();
            }
        } catch (error) {
            this.showError("Erreur lors de l'envoi. Veuillez réessayer plus tard.");
        }
    }
}

/* ==========================================================================
   COMPOSANT LISTE DES AVIS (<avis-list>)
   ========================================================================== */
class AvisList extends HTMLElement {
    constructor() {
        super();
        this.loadAvis();
    }

    // Chargement et affichage des avis stockés
    async loadAvis() {
        this.innerHTML = `<p>Chargement des avis...</p>`;
        try {
            const response = await fetch('assets/data/avis.json');
            const reviews = await response.json();

            if (reviews.length === 0) {
                this.innerHTML = "<p>Aucun avis pour le moment.</p>";
                return;
            }

            this.innerHTML = reviews.map(item => `
                <div style="border-bottom: 1px solid #eee; padding: 1.5rem 0;">
                    <p><strong>${item.prenom} ${item.nom}</strong> <small>(${item.ville})</small></p>
                    <p style="color: #ff6b35;">${"★".repeat(item.note)}${"☆".repeat(5-item.note)}</p>
                    <p style="font-style: italic;">"${item.avis}"</p>
                </div>
            `).join('');
        } catch (e) {
            this.innerHTML = `<p>Aucun avis disponible.</p>`;
        }
    }
}

// Enregistrement des balises personnalisées
customElements.define('avis-form', AvisForm);
customElements.define('avis-list', AvisList);