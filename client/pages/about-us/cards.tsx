import React from "react";

function Cards(props) {
  return (
    <div className="card-team col-12 col-md-6">
      <img className="card-team--image" src={props.src}></img>
      <h2 className="card-team--name">{props.name}</h2>
      <h4 className="card-team--position">{props.position}</h4>
      <p className="card-team--description">{props.description}</p>
    </div>
  );
}

export default Cards;
