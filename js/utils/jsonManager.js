export class JSONManager {
    static async fetchJSON(file) {
        try {
            const response = await fetch(`./json/${file}.json`);
            !response.ok && (() => { throw new Error(`Failed to fetch '${file}': ${response.statusText}`); })();
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        const files = ['strings', 'pages', 'keys', 'errors', 'actions', 'modes', 'types'];
        try {
            const results = await Promise.all(files.map(file => this.fetchJSON(file)));
            return Object.fromEntries(files.map((file, index) => [file, results[index] ?? {}]));
        } catch (error) {
            throw error;
        }
    }
}
