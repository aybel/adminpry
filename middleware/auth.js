const jwt=require('jsonwebtoken');

module.exports=function(req,res,next){

    //Leer el token del header
    const token=req.header('x-auth-token');
    //console.log(token);
    
    //Revisar si no hay token
    if(!token){
        return res.status(401).json({msg:"No hay token permiso no válido perro"})
    }


    //Validar el token

    try {
       // console.log(token);
       // console.log(process.env.SECRETA);
        const cifrado=jwt.verify(token,process.env.SECRETA);
       // console.log(cifrado);
        req.usuario=cifrado.usuario.id;
        next();
        
     } catch (error) {
         console.log(error);
       res.status(401).json({msg:'Error, Token no válido perrroooo2'});
    }
}