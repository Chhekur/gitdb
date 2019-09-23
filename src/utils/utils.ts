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

    public establishConnection(){
        if(global.gitdb.details == null){
            throw ("make the connection first");
        }
        else if(global.gitdb.connection == null){
            return new Promise(function(resolve, reject){
                try{
                    global.gitdb.connection = this.auth(global.gitdb.details);
                    // console.log(global);
                    resolve();
                }catch(error){
                    reject(error);
                }
            }.bind(this))
            .then(function(){
                return new Promise(function(resolve, reject){
                    this.setRepository(global.gitdb.details['username'], global.gitdb.details['repository'])
                    .then(function(){
                        this.setBranch(global.gitdb.details['branch'])
                        .then(function(){
                            resolve();
                        })
                        .catch(function(error){
                            reject(error);
                        })
                    }.bind(this))
                    .catch(function(error){
                        reject(error)
                    })
                }.bind(this))
                .catch(function(error){
                    throw error;
                })
            }.bind(this))
            .catch(function(error){
                console.error(error);
            });
        }
    }

    private setRepository(username, repository){
        return new Promise(function(resolve, reject){
            try{
                global.gitdb.repository = this.getRepository(username, repository, global.gitdb.connection);
                resolve();
            }catch(error){
                reject(error);
            }
        }.bind(this));
    }
}

export = new utils();