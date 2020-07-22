import createDataContext from './createDataContext';


const blogReducer = (state, action) => {
    switch(action.type){

        case 'edit_blogpost':
            return state.map((blogPost)=>{
                if(blogPost.id === action.payload.id){
                    return action.payload;
                }else{
                    return blogPost;
                }
            })
        case 'delete_blogpost':
            return state.filter( blogPost=> blogPost.id !== action.payload);

       

        case 'add_job':
            return [...state, {id:  Math.floor(Math.random() * 9999999) ,
            address:action.payload.address,
            desc:action.payload.desc,
            from:action.payload.from,
            to:action.payload.to     }];
        
        default:
            return state;
    }

}



const deleteBlogPost = (dispatch) =>{
    return (id) =>{
        dispatch( {type: 'delete_blogpost', payload: id } );
    }
}

const editBLogPost= (dispatch) =>{
    return (id ,title, content, callback) =>{
        dispatch({ type:'edit_blogpost',payload:{id, title, content}} );
        callback();
    }
}

const addJob = (dispatch) =>{
    return (address, desc, from , to, callback)=>{
        dispatch({type:'add_job',payload:{address, desc, from, to}});
        callback();
    }
}

export const {Context, Provider } = createDataContext(
    blogReducer,
    { deleteBlogPost, editBLogPost, addJob}, 
    [{address:'Test address', desc:'Test description', from:"1", to:'2', id:'11'}]
);