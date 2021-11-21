import React from "react";
import Posts from "../post/Posts";

const Home = () => (
  <div>
  <div className = "bgded" style={{
   backgroundImage: "url(" + "https://wallpapersmug.com/large/ba787c/black-dark-cubes-abstract.jpg" + ")",

  backgroundColor:"black",
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  }}>

    <div className="overlay" >

    <blockquote class="blockquote text-center">
    <br>
    </br>
    <br>
    </br>
  <h2 className="display-1 text-white" style = {{fontFamily: "Brush Script MT, Brush Script Std, cursive"}}> Memories </h2>
<br/>
<br/>
<br/>



<div >
  <table class=" text-white " style={{ marginLeft: "auto",
  marginRight: "auto"}} >

    <tr>
      <th>
      <img
        style={{ height: "200px", width: "200px" ,  borderRadius: "50%", border:"2px solid"}}
        className="img-thumbnail"
        src="https://www.productiveinsights.com/hubfs/David%20Meerman%20Scott.jpg"
        alt="ph"/>
      </th>
      <th> You can buy attention (advertising). You can beg for attention from the media (PR).<br/> You can bug people one at a time to get attention (sales). <br/>Or you can earn attention by creating something interesting and valuable <br/>and then publishing it online for free.
<br/>~David Meerman Scott</th>

    </tr>


  </table>
  </div>
  </blockquote>

</div>

    <div className="container" >

      <Posts />
    </div>
    </div>
    </div>

);

export default Home;
