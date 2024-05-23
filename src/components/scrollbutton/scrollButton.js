import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltUp } from '@fortawesome/free-solid-svg-icons'
 
const ScrollButton = () =>{
  
  const [visible, setVisible] = useState(false)
  let style={
    display:visible?"inline-flex":"none",
    justifyContent: "center",
    alignItems: "center",
    width: "30px",
    height: "30px",
    border: "none",
    outline: "none",
    borderRadius: "5px",
    backgroundColor: "#1f2f98",
    color: "#fff",
    fontSize: "18px",
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "10",
  }
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    console.log(scrolled)
    if (scrolled > 750){
      setVisible(true)
    } 
    else if (scrolled <= 750){
      setVisible(false)
    }
  };
  
  const scrollToTop = () =>{
    window.scrollTo({
      top: 0, 
      behavior: 'smooth'
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };
  
  window.addEventListener('scroll', toggleVisible);
  
  return (
    <button onClick={scrollToTop} style={{...style}}>
       <FontAwesomeIcon icon={faLongArrowAltUp} />
    </button>
  );
}
  
export default ScrollButton;