import React, {Component} from 'react'

const imageDir = importAll(require.context('./res/images', false, /\.png$/)); 

class Card extends Component{
    constructor(props){
        super(props)
        this.state = {
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e){
        if(this.props.user === "player"){
            this.props.selectCard(this.props.card)
        }
    }

    render(){
        let image = this.props.card.imagePath
        if(this.props.user === "player") {
            let cardClass = (this.props.selected) ? "selectedcard" : "card"
           // console.log(cardClass)
            return(
                <React.Fragment>
                    {/* <div> */}
                    <img onClick={this.handleClick} alt="card" className={cardClass} src={imageDir[image]}></img>
                    {/* </div> */}
                </React.Fragment>
            )
        } else if(this.props.user === "opponent"){
            return(
                <React.Fragment>
                    <div>
                    {/* <img onClick={this.handleClick} alt="card" className="card" src={imageDir["red_back.png"]}></img> */}
                    <img onClick={this.handleClick} alt="card" className={this.props.class} src={imageDir[image]}></img>
                    </div>
                </React.Fragment>
            )
        } else {
            return(
                <React.Fragment>
                    <div>
                    <img onClick={this.handleClick} alt="card" className="card" src={imageDir[image]}></img>
                    </div>
                </React.Fragment>
            )
        }
}}

/** 
 * Imports set of files at once
 * @param {Array} a items An array containing the items.
 */
function importAll(r) {
    let images = {};
    r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
    return images;
  }


export default Card