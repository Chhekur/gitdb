import GitHub = require("./GitHub.bundle") ;

class utils{
    
    public auth(details:Object){
        //console.log(GitHub);
        return new GitHub(details);
    }

    public getRepository(username: String, repository: String, gitdb_connection:any){
        if(gitdb_connection == null) throw ("make the connection first");
        return gitdb_connection.getRepo(username, repository);
    }

}

export = new utils();