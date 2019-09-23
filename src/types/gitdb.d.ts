declare namespace NodeJS {
    export interface Global {
        gitdb: {
            connection: any;
            repository: any;
            branch: any;
            details: any;
        }
    }
}