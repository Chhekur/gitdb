import GitHub = require("./GitHub.bundle") ;

class utils{
    
    public auth(details:Object){
        //console.log(GitHub);
        return new GitHub(details);
    }

    public getRepository(userName: String, repository: String, gh){
        return gh.getRepo(userName, repository);
    }
}

export = new utils();