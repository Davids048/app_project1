const Post = require('../../models/Post');

module.export = {
    Query:{
        async getPosts(){
            try{
                const posts = await Post.find();
                return posts;
            }
            catch(err){
                throw new Error(err);
            }
        }
    }
}