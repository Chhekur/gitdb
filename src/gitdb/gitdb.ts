import utils = require("../utils/utils");
class gitdb{

    constructor(){
        global.gitdb = {
            connection: null,
            repository: null,
            branch: null
        }
    }

    public connect(details:Object){
        if(details == null || details == undefined || details == {}){
            throw ("Please provide valid github credentials")
        }
        if(details['repository'] == undefined || details['branch'] == undefined){
            throw ("object with following attributes is required\n1. Token\n2. Repository\n3. Branch");
        }
        if(global.gitdb.connection == null){
            return new Promise(function(resolve, reject){
                try{
                    global.gitdb.connection = utils.auth(details);
                    // console.log(global);
                    resolve();
                }catch(error){
                    reject(error);
                }
            })
            .then(function(){
                this.setRepository(details['username'], details['repository'])
                .then(this.setBranch(details['branch']))
                .catch(function(error) { throw error; })
            }.bind(this))
            .catch(function(error){
                console.error(error);
            });
        }
    }

    private setBranch(branchname){
        if(global.gitdb.repository == null){
            throw ("make the connection first");
        }
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
                    console.error(error);
                })
            }else{
                // console.log('exist');
                global.gitdb.branch = branchname;
            }
        })
        .catch(function(error){
            console.error(error);
        });
    }

    private setRepository(username, repository){
        return new Promise(function(resolve, reject){
            try{
                global.gitdb.repository = utils.getRepository(username, repository, global.gitdb.connection);
                resolve();
            }catch(error){
                reject(error);
            }
        });
    }
}

export = new gitdb();