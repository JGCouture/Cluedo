import { useNavigate } from "react-router-dom"
import '../styles/join.css'
import { useRef, useState } from "react";

import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function Join(){

    const [code, setCode] = useState();
    const [holder, setHolder] = useState();

    let code_join = useRef();
 
    const navigate = useNavigate();

    function characterSelection(){
       
          
            navigate('/character', {state:{code_join}})
            
        
       
    }

    function code_to_join(event){

        code_join.current = event.target.value

    }

    function codeGenerate(){
        setCode(Math.floor(Math.random() * 9000) + 1000);
        setHolder();
      
    }

    function roomJoin(){
        setHolder("Code to Join");
        
    }
    
    
    return(
        <div className="container-fluid position-relative text-center bg-join">
             
             <div className="position-absolute top-50 start-50 translate-middle">
                <h1 className="mb-5">Select a Game Type</h1>
                <div className="d-flex justify-content-center align-items-center ">
                    <form>
                        <div className="form-floating">
                            <input type="text" className="form-control" id="floatingInput" placeholder="" />
                            <label htmlFor="floatingInput">Player Name</label>
                        </div>
                        <div className="my-3">
                            <div className="form-check">
                                <Popup trigger={
                                        <input onChange={codeGenerate} id="debit" name="paymentMethod" type="radio" className="form-check-input" required="" />
                                        } position="left center">

                                        <div>Code is: {code}</div>
                                </Popup>
                               
                                <label className="create-room form-check-label" htmlFor="debit">Create a Room</label>
                            </div>
                            <div className="form-check">
                                <input id="paypal" onChange={roomJoin} name="paymentMethod" type="radio" className="form-check-input" required="" />
                                <label className="join-room form-check-label" htmlFor="paypal">Join a Room</label>
                            </div>
                        </div>

                        <div className="play-type" id="play-type">
                            <input type="text" onChange={code_to_join} className="form-control" id="join-code floatingInput" placeholder={holder}/>
                        </div>
                       
                    </form>
                    
                
                </div>
                
             </div>

             <div className="fixed-bottom mb-5 pb-5">
                <button onClick={characterSelection} type="button" className="continue-button mt-3"><p className="continue-text">Continue</p></button>
             </div>
           

            <div className="fixed-bottom">
                <footer className="text-body-secondary text-center text-small mt-md-5">
                    <p className="foot-info mb-1">© 2023–2024 GameJHU</p>
                </footer>
            </div>
        </div>


    )

}