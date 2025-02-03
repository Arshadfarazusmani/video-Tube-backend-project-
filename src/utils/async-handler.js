// Purpose: Handle async functions in express routes.

const asynchandler= (fn)=>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch((err)=>{
            next(err);
        });

    }
}
 
export {asynchandler};