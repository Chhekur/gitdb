import GitHub = require("./GitHub.bundle") ;

class utils{
    
    public auth(details:Object){
        //console.log(GitHub);
        return new GitHub(details);
    }

    public getRepository(username: String, repository: String, gitdb_connection:any){
        return gitdb_connection.getRepo(username, repository);
    }

    public setBranch(branchname){
        return global.gitdb.repository.listBranches()
        .then(function(branches){
            // console.log(branches);
            let exist = branches.data.find(branch => branchname === branch.name);
            if(!exist){
                // console.log('not exist');
                return global.gitdb.repository.createBranch('master', branchname)
                .then(function(){
                    global.gitdb.branch = branchname;
                })
                .catch(function(error){
                    throw error;
                })
            }else{
                // console.log('exist');
                global.gitdb.branch = branchname;
            }
        })
        .catch(function(error){
            throw error;
        });
    }

    public getCurrentCommitSHA(callback){
        console.log(global.gitdb.branch);
        console.log(`heads/${global.gitdb.branch}`);
        return global.gitdb.repository.getRef(`heads/${global.gitdb.branch}`)
        .then(function(ref){
            callback(ref.data.object.sha);
        })
        .catch(function(error){
            throw error;
        });
    }

    public getTreeSHA(commitSHA, callback){
        return global.gitdb.repository.getCommit(commitSHA)
        .then(function(commit){
            callback(commit.data.tree.sha);
        })
        .catch(function(error){
            throw error;
        })
    }
}

export = new utils();