import "../styles/Board.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef} from 'react';
import { useLocation } from 'react-router-dom';
import scarlet from "../images/scarlet.PNG";
import green from "../images/green.PNG";
import mustard from "../images/mustard.PNG";
import white from "../images/white.PNG";
import plum from "../images/plum.PNG";
import peacock from "../images/peacock.PNG";

import wrench from "../images/wrench.png";
import candlestick from "../images/candlestick.png";
import rope from "../images/rope.png";
import revolver from "../images/revolver.png";
import lead_pipe from "../images/lead-pipe.png";
import dagger from "../images/dagger.png";

import study from "../images/study.png";
import hall from "../images/hall.png";
import conservatory from "../images/conservatory.png";
import ballroom from "../images/ballroom.png";
import billiard from "../images/billiard.png";
import kitchen from "../images/kitchen.png";
import dinning from "../images/dinning.png";
import lounge from "../images/lounge.png";
import library from "../images/library.png";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import io from 'socket.io-client'
// import { getIcon } from "react-toastify/dist/components";
const socket = io.connect('http://localhost:4000');


export default function Board(props) {

    const navigate = useNavigate();

    const suggestedSuspect = useRef();
    const suggestedWeapon = useRef();
    const suggestedPlace = useRef();

    const approvedSuspect = useRef();
    const approvedWeapon = useRef();
    const approvedPlace = useRef();

    
    const characterRef = useRef(null);
    let character_turn = useRef(0);

    //Track the current location of the character
    const location_index = useRef();
    const track_location = useRef(null);

    const  isInitialMount = useRef(false)
    
    //Capture the selected character 
    const { state: [character_from_selection, selected_characters]} = useLocation();


    let randomWeapon = useRef();
    let randomRoom = useRef();

    let finalWeapon = useRef();
    let finalRoom = useRef();
    let finalSuspect = useRef();
    const characters_index = {"scarlet": "0", "green": "1", "mustard": "2", "peacock": "3", "plum": "4", "white": "5"};

    let character_cards = useRef(["scarlet", "green", "mustard", "white", "plum", "peacock"]);
    let characters_turn = useRef(0);
    
    useEffect(() => {
        window.onbeforeunload = () => {return ""};

        return () => {window.onbeforeunload = null}
    }, [])

    useEffect(() => {

        // Listening for the "send_backend" event once when the component mounts
        socket.on("send_backend", (message) => {
       
            randomWeapon.current = message.message_back[1][characters_index[character_from_selection.character]]
            randomRoom.current= message.message_back[2][characters_index[character_from_selection.character]]

            finalSuspect.current = message.message_back[0][0]
            finalWeapon.current = message.message_back[1][message.message_back[1].length-1]
            finalRoom.current = message.message_back[2][message.message_back[2].length-1]

        });
    }, []);

    
    useEffect(() => {

        function initialization(){

            if (character_from_selection.character) {
                let rooms = ["study11", "hall13", "lounge15", "library31", "billiard33", "dinning35", "conservatory51", "ballroom53", "kitchen55"];
        
                //Initialize the character's room 
                const room_position_index = Math.floor(Math.random() * rooms.length);
                let room_position = rooms[room_position_index];
                
                location_index.current = parseInt(room_position.substring(room_position.length - 2));
        
                //Get the source of the character image 
                let img_src;
                [scarlet, green, mustard, white, plum, peacock].forEach((el) => {
                    if (el.includes(character_from_selection.character)) {
                        img_src = el;
                    }
                });
        
                const img = document.createElement("img");
                img.src = img_src;
                img.style.height = "50%";
                img.style.width = "50%";
                img.alt = character_from_selection.character;
                img.id = character_from_selection.character;
                img.onclick = character_selected;
    
                document.getElementById(room_position).appendChild(img);

    
                //socket the character on the map
                socket.emit("character_map", {"on_map":[room_position, character_from_selection.character, img.src]});


            }
        }

    

        setTimeout(initialization, 1000);

    
    }, [character_from_selection.character]);    

   // Socket receive the character on the map
    useEffect(() => {

        socket.on("receive_map", (data) => {

                const img = document.createElement("img");
                img.src = data.on_map[2];
                img.style.height = "50%";
                img.style.width = "50%";
                img.alt = data.on_map[1];
                img.id = data.on_map[1];
                img.onclick = character_selected;
    
                document.getElementById(data.on_map[0]).appendChild(img);

               
             
                const notifyInitial = () => toast.success(
                    <div>
                        {selected_characters.selected.current[characters_turn.current]}'s Turn
                        
                    </div>,
        
                    {   
                        position: "bottom-right",
                        autoClose: 1000,
                        
                    }
                );
        
                // Run notifyInitial only once when the component mounts
                if (!isInitialMount.current) {
                    notifyInitial();
                    isInitialMount.current = true;
                }
           ;

        })
    }, []);
    
    
    function character_selected(event) {
        // Logic to handle the selection of the character
        // For example, you can change the border color of the selected character
        if (event.target.style.border === "2px solid red"){
            event.target.style.border = "";
            characterRef.current = "";

        }else{
            event.target.style.border = "2px solid red";      
            // Store the reference to the selected character
            characterRef.current = event.target;
        }
  
    }


    //Suggestion and accusation toastify
    const notify = () => toast(
        <div className="custom-toast">
            <select className="form-select mb-2" onChange={handleSuspect}>
                <option defaultValue="WHO DO IT">WHO DO IT</option>
                <option value="scarlet">scarlet</option>
                <option value="green">green</option>
                <option value="mustard">mustard</option>
                <option value="plum">plum</option>
                <option value="white">white</option>
                <option value="peacock">peacock</option>
            </select>
       
            <select className="form-select mb-2" onChange={handleWeapon}>
                <option defaultValue="WHI WHAT">WITH WHAT</option>
                <option value="rope">rope</option>
                <option value="wrench">wrench</option>
                <option value="candlestick">candlestick</option>
                <option value="revolver">revolver</option>
                <option value="lead-pipe">lead pipe</option>
                <option value="dagger">dagger</option>
            </select>
         
            <select className="form-select mb-2" onChange={handlePlace}>
                <option defaultValue="WHERE DO IT">WHERE DO IT</option>
                <option value="study">study</option>
                <option value="hall">hall</option>
                <option value="lounge">lounge</option>
                <option value="library">library</option>
                <option value="billiard">billiard</option>
                <option value="dinning">dinning</option>
                <option value="conservatory">conservatory</option>
                <option value="ballroom">ballroom</option>
                <option value="kitchen">kitchen</option>
            </select>
            
            <div className="d-flex justify-content-center">
                <button onClick={getSuggestion} type="button" className="btn btn-info me-2">Suggestion</button>
                <button onClick={getAccusation} type="button" className="btn btn-success">Accusation</button>
            </div>

        </div>
        , {
        position: "top-center",
        autoClose: false,
        className: "toast-message",
    
    });

    function handleSuspect(event){
        suggestedSuspect.current = event.target.value;
    }
    
    function handleWeapon(event){
        suggestedWeapon.current = event.target.value;
        
    }

    function handlePlace(event){
        suggestedPlace.current = event.target.value;
       
    }

    function getSuggestion(){
        const notify2 = () => toast.info(
            <div className="suggest-toast">
                Suggestion: {suggestedSuspect.current} uses the {suggestedWeapon.current} in the {suggestedPlace.current} room
            </div>,

            {
                theme: "colored",
                autoClose: 5000,
                closeOnClick: true,
            }
        );

        notify2();

        //Socket the suggestion
        socket.emit("send_suggestion", {"suggestion_message":[suggestedSuspect.current,suggestedWeapon.current,suggestedPlace.current]});

    }

    useEffect(() => {

        socket.on("receive_suggestion", (data) => {
          

            const notify3 = () => toast.info(
                <div className="suggest-toast">
                    Suggestion: {data.suggestion_message[0]} uses the {data.suggestion_message[1]} in the {data.suggestion_message[2]} room
                </div>,
    
                {
                    theme: "colored",
                    autoClose: 5000,
                    closeOnClick: true,
                }
            );
    
            notify3();

            const notify4 = () => toast(
                <div className="approve-toast">
                    <select className="form-select mb-2" onChange={handleApprovedSuspect}>
                        <option defaultValue="no-comment">no comment</option>
                        <option value={`yes${data.suggestion_message[0]}`}>I have {data.suggestion_message[0]}</option>
                        <option value={`no${data.suggestion_message[0]}`}>I don't have {data.suggestion_message[0]}</option>
                    </select>

                    <select className="form-select mb-2" onChange={handleApprovedWeapon}>
                        <option defaultValue="no-comment">no comment</option>
                        <option value={`yes${data.suggestion_message[1]}`}>I have {data.suggestion_message[1]}</option>
                        <option value={`no${data.suggestion_message[1]}`}>I don't have {data.suggestion_message[1]}</option>
                    </select>

                    <select className="form-select mb-2" onChange={handleApprovedPlace}>
                        <option defaultValue="no-comment">no comment</option>
                        <option value={`yes${data.suggestion_message[2]}`}>I have {data.suggestion_message[2]}</option>
                        <option value={`no${data.suggestion_message[2]}`}>I don't have {data.suggestion_message[2]}</option>
                    </select>

                    <div className="d-flex justify-content-center">
                        
                        <button type="button" className="btn btn-light" onClick={approvedSuggestion}>Approve</button>
                    </div>

                </div>,
    
                {
                    
                    position: "bottom-center",
                    autoClose: false,
                }
            );
    
            notify4(); 

        })
    }, []);

    function handleApprovedSuspect(event){

        approvedSuspect.current = event.target.value

    }

    function handleApprovedWeapon(event){
        approvedWeapon.current = event.target.value
    }

    function handleApprovedPlace(event){

        approvedPlace.current =  event.target.value
    }

    
    function approvedSuggestion(){

        const note_position = {"scarlet": "0", "green": "1", "mustard": "2", 
                                "peacock": "3", "plum": "4", "white": "5"};

        const temp = note_position[character_from_selection.character];

        let checked_list = {}

        if (approvedSuspect.current.includes("yes")){
            const note_suspect = approvedSuspect.current.substring(3);

           
            const position_id = temp + note_suspect;

            checked_list[position_id] = "checked";

            document.getElementById(position_id).setAttribute("value", "checked");


        }else{
            const note_suspect = approvedSuspect.current.substring(2);
            const position_id = temp + note_suspect;

            checked_list[position_id] = "unchecked";

            document.getElementById(position_id).setAttribute("value", "unchecked");
        }


        const note_position2 = {"rope": "0", "wrench": "1", "candlestick": "2", 
                                "revolver": "3", "lead-pipe": "4", "dagger": "5"};

        if (approvedWeapon.current.includes("yes")){
            const note_weapon = approvedWeapon.current.substring(3);
          
            const position_id = temp + note_weapon;

            checked_list[position_id] = "checked";

            document.getElementById(position_id).setAttribute("value", "checked");


        }else{
            const note_weapon = approvedWeapon.current.substring(2);
            const position_id = temp + note_weapon;

            checked_list[position_id] = "unchecked";

            document.getElementById(position_id).setAttribute("value", "unchecked");
        }


         const note_position3 = {"study": "0", "hall": "1", "lounge": "2", 
                                "library": "3", "billiard": "4", "dinning": "5", "conservatory":"6",
                                "ballroom":"7", "kitchen":"8"};

        if (approvedPlace.current.includes("yes")){
            const note_place = approvedPlace.current.substring(3);
          
            const position_id = temp + note_place;

            checked_list[position_id] = "checked";

            document.getElementById(position_id).setAttribute("value", "checked");


        }else{
            const note_place = approvedPlace.current.substring(2);
          
            const position_id = temp + note_place;

            checked_list[position_id] = "unchecked";

            document.getElementById(position_id).setAttribute("value", "unchecked");
        }

        socket.emit("send_noteCheck", {"message_check": checked_list})

    }

    useEffect(() => {
        socket.on("receive_noteCheck", (message) => {
            for (let key in message.message_check) {
                const inputElement = document.getElementById(key);
                if (inputElement) {
                    inputElement.setAttribute("value",  message.message_check[key]); // Set the checked property based on the value received
                }
            }
        });
    }, []);
    

    function getAccusation(){

        const weapons = ["wrench", "lead_pipe", "rope", "revolver", "dagger", "candlestick"]
        const rooms = ["hall", "study", "kitchen", "conservatory", "ballroom", "billiard", "library", "lounge"]

        if (suggestedSuspect.current==finalSuspect.current && suggestedWeapon.current == weapons[finalWeapon.current] && suggestedPlace.current == rooms[finalRoom.current]){
            navigate("/win")
        }

    }


    function character_movement(event) {

        if (selected_characters.selected.current[characters_turn.current] === character_from_selection.character){
            if (characterRef.current) {
    
                const next_location = document.getElementById(event.target.id);
    
                const next_index = parseInt(event.target.id.substring(event.target.id.length - 2));
    
                //Only allow vertical or horizontal movement by one step each time
                if ([location_index.current + 1, location_index.current - 1, location_index.current + 10, location_index.current - 10, 
                    location_index.current + 44, location_index.current - 44, location_index.current + 36, location_index.current -36].includes(next_index) &&
                    !event.target.className.includes("occupied")) {
    
                    next_location.appendChild(characterRef.current);
                    location_index.current = next_index;
    
                    socket.emit("send_move", {"message_move":[next_location.id,characterRef.current.src, characterRef.current.id]});
    
                  
                    if ((characters_turn.current) < selected_characters.selected.current.length - 1){

                        characters_turn.current++
        
                    }else{
                        characters_turn.current = 0
                    }

                      //Make suggestion or accusation
                    
                      if([11,13,15,31,33,35,51,53,55].includes(location_index.current)){
    
                        notify();


                        const notify5 = () => toast.success(
                            <div>
                                {/* Waiting for {character_from_selection.character} making suggestion or accusation */}
                                
                                {selected_characters.selected.current[characters_turn.current]} 's Turn
                                
                            </div>,
                
                            {   
                                position: "bottom-right",
                                autoClose: 1000,
                                
                            }
                        );
                
                        notify5();
        
                        }else{


                            const notify5 = () => toast.success(
                                <div>
    
                                    {selected_characters.selected.current[characters_turn.current]}'s Turn
                                    
                                </div>,
                    
                                {   
                                    position: "bottom-right",
                                    autoClose: 1000,
                                    
                                }
                            );
                    
                            notify5();

                        }

                }

    
            }

        }
        
    }

    useEffect(() => {
        socket.on("receive_move", (data) => {

            const elementToRemove = document.getElementById(data.message_move[2]);
            if (elementToRemove) {
                elementToRemove.remove();
            }

            const img = document.createElement("img");
            img.src = data.message_move[1];
            img.style.height = "50%";
            img.style.width = "50%";
            img.alt = data.message_move[2];
            img.id = data.message_move[2];

            let next_location = document.getElementById(data.message_move[0]);

            if (next_location.className.includes("hallway")){
                next_location.classList.add("occupied");

            }
               
            next_location.appendChild(img);

            // socket.emit("send_location_check", {"message_location_check":next_location.id})

            if ((characters_turn.current) < selected_characters.selected.current.length - 1){

                characters_turn.current++

            }else{
                characters_turn.current = 0
            }

            const notify7 = () => toast.success(
                <div>
                    {selected_characters.selected.current[characters_turn.current]}'s Turn
                    
                </div>,
    
                {   
                    position: "bottom-right",
                    autoClose: 1000,
                    
                }
            );
    
            notify7();
           
        });
    
    }, []);

    //Initialize the cards for each player
    function cardInfo(){

        let img_src 

        [scarlet, green, mustard, white, plum, peacock].forEach((el) => {
            if (el.includes(character_from_selection.character)) {
                img_src= el;
            }
        });
        const card_weapons = [wrench, lead_pipe, rope, revolver, dagger, candlestick]
        const card_rooms = [hall, study, kitchen, conservatory, ballroom, billiard, library, lounge]
        const notify = () => toast(

            <div>
                Your Character: 
                <img src={img_src}style={{ height: '4em', width: '4em' }}/>

                <div>
                    Your Weapon:
                    <img className="rounded mt-3" src={card_weapons[randomWeapon.current]} style={{height:"6em", width:"6em"}}/>

                </div>

                <div>
                    Your Room:
                    <img className="rounded mt-3" src={card_rooms[randomRoom.current]} style={{height:"8em", width:"8em"}}/>

                </div>

            </div>
            
            , 
            {
            position: "top-left",
            autoClose: false,
            closeOnClick: true,
            className: "card-toast"
        });

        notify()
    } 


    return (
        <div className="container-fluid pe-0">
            <div className="row">
                <div className="board-bg left-box col-8 d-flex justify-content-center align-items-center shadow-lg">
                    <div className="game-board">
                        <div className="row ms-2">
                            <div className="col study" id="study11" onClick={character_movement}>
                                <div>
                                    <ToastContainer />
                                </div>
                            </div>
                            <div className="col hallway" id="hallway12" onClick={character_movement}></div>
                            <div className="col hall" id="hall13" onClick={character_movement}>
                             
                            </div>
                            <div className="col hallway" id="hallway14" onClick={character_movement}></div>
                            <div className="col lounge" id="lounge15" onClick={character_movement}></div>
                        </div>

                        <div className="row ms-2">
                            <div className="col hallway-vertical" id="hallway21" onClick={character_movement}></div>
                            <div className="col"></div>
                            <div className="col hallway-vertical" id="hallway23" onClick={character_movement}></div>
                            <div className="col"></div>
                            <div className="col hallway-vertical" id="hallway25" onClick={character_movement}></div>
                        </div>

                        <div className="row ms-1">
                            <div className="col library" id="library31" onClick={character_movement}></div>
                            <div className="col hallway" id="hallway32" onClick={character_movement}></div>
                            <div className="col billiard" id ="billiard33" onClick={character_movement}></div>
                            <div className="col hallway" id="hallway34" onClick={character_movement}></div>
                            <div className="col dinning" id="dinning35" onClick={character_movement}></div>

                        </div>

                        <div className="row ms-1">
                            <div className="col hallway-vertical" id="hallway41" onClick={character_movement}></div>
                            <div className="col"></div>
                            <div className="col hallway-vertical" id="hallway43" onClick={character_movement}></div>
                            <div className="col"></div>
                            <div className="col hallway-vertical" id="hallway45" onClick={character_movement}></div>
                        </div>

                        <div className="row ms-1">
                            <div className="col conservatory" id="conservatory51" onClick={character_movement}></div>
                            <div className="col hallway" id="hallway52" onClick={character_movement}></div>
                            <div className="col ballroom" id="ballroom53" onClick={character_movement}></div>
                            <div className="col hallway" id="hallway54" onClick={character_movement}></div>
                            <div className="col kitchen" id="kitchen55" onClick={character_movement}></div>
                        </div>
                    </div>
                </div>

                <div className="col-4">
                   
                    <div className="note-table shadow-lg">
                        <table className="table ms-2">
                            
                            <tbody>
                                <tr>
                                    <th className="row text-success mb-0">WHO DO IT?</th>
                                 

                                    {["danger", "success", "warning", "secondary","primary", "info"].map((color, index) => 
                                    <td className="col ps-1" key={index}>
                                        <button className={`btn btn-${color}`} onClick={cardInfo} />
                                    </td>
                                    
                                    )}

                                </tr>
                            </tbody>
                 
                            <tbody>
                                {["scarlet", "green", "mustard", "peacock", "plum", "white"].map((character, index) => (
                                <tr key={index}>
                                    <th className={`row ${character}`} scope="row">{character}</th>
                                    {[...Array(6)].map((_, j) => (
                                    <td className="col" key={j}>
                                        <input className="form-check-input" type="checkbox" value="" id={`${j}${character}`} disabled/>
                                    </td>
                                    
                                    ))}
                                </tr>
                                ))}
                            </tbody>
                            
                           
                            <tbody>
                                <tr>
                                    <th className="row text-danger mb-0">WITH WHAT</th>
                                </tr>

                                {["rope", "wrench", "candlestick", "revolver", "lead-pipe", "dagger"].map((character, index) => (
                                <tr key={index}>
                                    <th className={`row ${character}`} scope="row">{character}</th>
                                    {[...Array(6)].map((_, j) => (
                                    <td className="col" key={j}>
                                        <input className="form-check-input" type="checkbox" value="" id={`${j}${character}`} disabled/>
                                    </td>
                                    ))}
                                </tr>
                                ))}
                            </tbody>
                            
                         
                            <tbody>
                                <tr>
                                    <th className="row text-info mb-0">WHERE DO IT?</th>
                                </tr>
                                
                                {["studyT", "hallT", "loungeT", "libraryT", "billiardT", "dinningT", "conservatoryT", "ballroomT", "kitchenT"].map((character, index) => (
                                <tr key={index}>
                                    <th className={`row ${character}`} scope="row">{character.substring(0,character.length-1)}</th>
                                    {[...Array(6)].map((_, j) => (
                                    <td className="col" key={j}>
                                        <input className="form-check-input" type="checkbox" value="" id={`${j}${character.substring(0,character.length-1)}`} disabled/>
                                    </td>
                                    ))}
                                </tr>
                                ))}
                            </tbody>


                        </table>
                    </div>

                </div>


                
            </div>
        </div>
        
    );
}
