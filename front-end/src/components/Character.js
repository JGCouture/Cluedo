import scarlet from '../images/scarlet.PNG'
import green from '../images/green.PNG'
import mustard from '../images/mustard.PNG'
import white from '../images/white.PNG'
import plum from '../images/plum.PNG'
import peacock from '../images/peacock.PNG'
import {useEffect, useRef} from 'react'
import { useNavigate, useLocation} from "react-router-dom";


import '../styles/character.css'

import io from 'socket.io-client'
const socket = io.connect('http://localhost:4000');

export default function Character(){

    const { state: code_to_join } = useLocation();

    let selected_count = useRef([]);
    //Store selected character
    let character_selected = useRef();

    const navigate = useNavigate();

    //Trigger the function to navigate the board page
    function gameBoard(){

        if(character_selected){

            //Pass the selected character to the board 
            navigate('/board', { state: [{ character: character_selected.current}, {selected:selected_count}]});
            socket.emit("send_start",{"message_start":"let's play"});
        } 
    }
    useEffect(() => {
        console.log(code_to_join.code_join.current)
        window.onbeforeunload = () => {return ""};

        return () => {window.onbeforeunload = null}
    }, [])

    useEffect(() => {

        socket.on("receive_start",(data) =>{

            navigate('/board', { state: [{ character: character_selected.current}, {selected:selected_count}]});

        })

    }, [])
    
    //Select or unselect the character
    function selected(character){

        if(document.getElementById(character).textContent === "Select"){
            document.getElementById(character).textContent = "Selected";
            character_selected.current = character;

            selected_count.current.push( character_selected.current)
            // Store the selected character in localStorage
            // localStorage.setItem('selectedCharacter', character);

            socket.emit("send_message", {"message": [character, 'true']}, code_to_join.code_join.current);

        }else{
            document.getElementById(character).textContent = "Select";
            character_selected.current = "";

            selected_count.current.pop( character_selected.current)

            socket.emit("send_message", {"message": [character, 'false']}, code_to_join.code_join.current);
        }

    }
    
    //Socket the character selection
    useEffect(() => {

        socket.on("receive_message", (data, room) => {  
            
            if(room === code_to_join.code_join.current){

                if (data.message[1] === 'true'){
                    document.getElementById(data.message[0]).innerText = "Selected";
    
                    selected_count.current.push(data.message[0])
    
        
                }else{
                    document.getElementById(data.message[0]).innerText = "Select";
    
                    selected_count.current.pop(data.message[0])
                    
                }

            }
           
        });
    }, []);


    return(
        <div className="container-fluid position-relative text-center bg-char">
            <div className="characters row text-center ms-5">
                <div className="col-2 character-box">
                    <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header py-3">
                        <h4 className="my-0 fw-normal">Scarlet</h4>
                    </div>
                    <div className="card-body">
                        <img className='img-fluid rounded' src={scarlet} alt='scarlet' />
                        <button onClick={() => selected('scarlet')} type="button" className="w-100 btn btn-lg btn-outline-primary" id="scarlet">Select</button>
                    </div>
                    </div>
                </div>

                <div className="col-2 character-box">
                    <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header py-3">
                        <h4 className="my-0 fw-normal">Green</h4>
                    </div>
                    <div className="card-body">
                    <img className='img-fluid rounded' src={green} alt='green' />
                        <button onClick={() => selected('green')} type="button" className="w-100 btn btn-lg btn-outline-primary" id="green">Select</button>
                    </div>
                    </div>
                </div>

                <div className="col-2 character-box">
                    <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header py-3">
                        <h4 className="my-0 fw-normal">Mustard</h4>
                    </div>
                    <div className="card-body">
                    <img className='img-fluid rounded' src={mustard} alt='mustard' />
                        <button onClick={() => selected('mustard')} type="button" className="w-100 btn btn-lg btn-outline-primary" id="mustard">Select</button>
                    </div>
                    </div>
                </div>

                <div className="col-2 character-box">
                    <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header py-3">
                        <h4 className="my-0 fw-normal">Peacock</h4>
                    </div>
                    <div className="card-body">
                    <img className='img-fluid rounded' src={peacock} alt='peacock' />
                        <button onClick={() => selected('peacock')} type="button" className="w-100 btn btn-lg btn-outline-primary" id="peacock">Select</button>
                    </div>
                    </div>
                </div>

                <div className="col-2 character-box">
                    <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header py-3">
                        <h4 className="my-0 fw-normal">Plum</h4>
                    </div>
                    <div className="card-body">
                    <img className='img-fluid rounded' src={plum} alt='plum' />
                        <button onClick={() => selected('plum')} type="button" className="w-100 btn btn-lg btn-outline-primary" id="plum">Select</button>
                    </div>
                    </div>
                </div>

                <div className="col-2 character-box">
                    <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header py-3">
                        <h4 className="my-0 fw-normal">White</h4>
                    </div>
                    <div className="card-body">
                    <img className='img-fluid rounded' src={white} alt='white' />
                        <button onClick={() => selected('white')} type="button" className="w-100 btn btn-lg btn-outline-primary" id="white">Select</button>
                    </div>
                    </div>
                </div>
              
            </div>

          

            <div className="fixed-bottom mb-5 pb-5">
                <button className='play-button' onClick={gameBoard} type="button"><span className='play-text'>Play Game</span></button>
             
            </div>
        
            <div className="fixed-bottom">
                <footer className="text-body-secondary text-center text-small mt-md-5">
                    <p className="foot-info mb-1">© 2023–2024 GameJHU</p>
                </footer>
            </div>
        </div>
    )


}