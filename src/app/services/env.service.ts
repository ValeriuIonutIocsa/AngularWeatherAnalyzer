import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EnvService {

    private envResponseJson: any;

    async loadConfig() {

        const response = await fetch('/.netlify/functions/get-env');
        this.envResponseJson = await response.json();
    }

    get getSupabaseProjectUrl() {
        return this.envResponseJson?.supabaseProjectUrl;
    }

    get getSupabaseApiKey() {
        return this.envResponseJson?.supabaseApiKey;
    }
}
