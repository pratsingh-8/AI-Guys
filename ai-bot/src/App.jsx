import React, { useRef, useState} from 'react'
import {useForm} from 'react-hook-form'
import './index.css'
const App = () => {
  const fileref=useRef(null);
  const [val,setval]=useState([])
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm();
  const backend=async (data)=>{
      const updatedmessag = [...val,{
          user:data.user
      }]
    
      try{
        const response = await fetch('http://localhost:1000/api/chat',{
        method:'post',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({
          message:updatedmessag
        })
      });

      const res = await response.json();
      setval([...updatedmessag,{
        AI:res.reply
      }])
      // console.log(res.reply);
      reset();
    }catch(err){
      console.log(err.message);
    }
  }
  return (

    <div className='heading'>
      <center><h1>Ace Bot</h1></center>
      <div className="cont">
        <div className="response">
            {
                val.map((item, index) => (
                  <div key={index}>

                    {item.user && (
                      <div className="user-message">
                        <p>user: {item.user}</p>
                      </div>
                    )}

                    {item.AI && (
                      <div className="ai-message">

                        <p>user: {item.AI}</p>
                        <br/>
                      </div>
                    )}

                  </div>
            
                ))
            }
        </div>
        <div className="inp">
          <form className='f1' onSubmit={handleSubmit(backend)}>
                  {/* <input type='file'{...register('userfile')} ref={fileref} style={{display:'none'}} onChange={(e)=>setValue('userfile',e.target.files)}></input>
                  <button type='button' className='btn' onClick={()=>{return fileref.current.click()}}>+</button>
                  */}
                  <input className='inp' {...register('user',{required:true,})} placeholder='ask me anything'/>
                  <button type='submit' className='btn'>GO</button>
          </form>
        </div>
      </div>
    </div> 
  )
}

export default App
