import "./list.css"
import Userinfo from "./userinfo/Userinfo.jsx";
import ChatList from "./chatList/chatList.jsx";
import Textbox from "./textbox/textbox.jsx";
import Footer from "./footer/footer.jsx";
const List = () => {
  return (
    <div className='list'>
      <Userinfo/>
      <ChatList/>
      <Textbox/>
      {/* <Footer/> */}
    </div>
  )
}

export default List
