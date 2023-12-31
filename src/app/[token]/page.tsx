"use client";
import { on } from "events";
import Image from "next/image";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
type Props = {
  params:{}
};

// export async function getItem() {
//   const res = await fetch("http://54.179.86.5:8765/v1/item_prm");
//   const data = await res.json();
//   return data;
// }

export async function getItem(params:any) {
  let id = params.token;
  let zlib = require('zlib');
  let jsn2 = {
    "OutletID": 80,
    "TableID": 4,
    "token": `${id}`,
  }
  console.log(jsn2);
  let item_qr = "item_qr";
  let body =  zlib.deflateSync(JSON.stringify(jsn2));
  let res = await fetch("http://54.179.86.5:8765/v1/"+item_qr,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/octet-stream',
      },
      body: body.slice(2),
    }
     );
    
    let resBuffer = await res.arrayBuffer();

    let data =  JSON.parse(zlib.unzipSync(Buffer.from([120, 156, ...new Uint8Array(resBuffer)])));

    return data;
  }

export async function postItem(cart:any) {

  let zlib = require('zlib');
   let body =  zlib.deflateSync(JSON.stringify(cart));
  let res = await fetch("http://54.179.86.5:8765/v1/order_qr",
    {
      method: 'POST',
      headers: {
        'content-type': 'application/octet-stream',
      },
      body: body.slice(2),
    }
     );
    
    let resBuffer = await res.arrayBuffer();

    let data_cart =    JSON.parse(zlib.unzipSync(Buffer.from([120, 156, ...new Uint8Array(resBuffer)])));

    return {
      props: {data_cart},
    };
  }

  export async function getOrder(TableID:any , OutletID:any) {
    let zlib = require('zlib');
    let cart_ord = {
      'OutletID': OutletID,
      'TableID': TableID,
    }
    let body =  zlib.deflateSync(JSON.stringify(cart_ord));
   let res = await fetch("http://54.179.86.5:8765/v1/order",
     {
       method: 'POST',
       headers: {
         'content-type': 'application/octet-stream',
       },
       body: body.slice(2),
     }
      );
     
     let resBuffer = await res.arrayBuffer();
 
     let data_ord =   JSON.parse(zlib.unzipSync(Buffer.from([120, 156, ...new Uint8Array(resBuffer)])));
    
     return data_ord;
  }

  // export async function getOrder() {
  //   const res = await fetch("http://54.179.86.5:8765/v1/order");
  //   const data_ord = await res.json();
  //   console.log(data_ord);
  //   return  data_ord;
  // }
  // 'OutletID': '70',
  // 'TableID': '4',

export default function Home({params}: Props) {
  const isSushi = ["51306", "51307", "51321", "51323","51324",
, "51325", "51327", "51328", "515020"]
const isBeef = ["51317", "51318", "51320", "74134", "51353", "514005" ,"514007",
  "514002", "514003", "74101", "74108", "74117"]
  const isSeafood = ["51337", "51338", "51339", "514008", "79152",
  "74118", "74119", "74129"]
  const isDesert = ["51347", "51348", "51350", "51351", "5973138"]
  const isVegeis  = ["75101", "75102", "75103", "75104", "75106", "75109", "75110"
  , "75111", "75125", "79167"]
  const isNoodle = ["74116", "75115", "75116", "75117"]

  // ลูกค้าเดินไปตักเอง
  //   const isPizza = ["76102", "76104", "76106", "76109", "76110"]
  //   const isSnacks = ["76114", "76115", "76117", "76118", "76121",
  //   "76122", "76123", "76133", "76138", "76143", "77101", "77102",
  // "77108", "7107", "77109", "77111", "77128", "77133"]
  // const isDrink = ["78127", "78128", "78129", "79133", "79131", "79130","79129"]
  
  
  const [data, setData] = useState<any>([]);
  const [order, setOrder] = useState<any>([]);
  const [dataSushi, setDataSushi] = useState<any>([]);
  const [dataBeef, setDataBeef] = useState<any>([]);
  const [dataSeafood, setDataSeafood] = useState<any>([]);
  const [dataDesert, setDataDesert] = useState<any>([]);
  const [dataVegeis, setDataVegeis] = useState<any>([]);
  const [dataNoodle, setDataNoodle] = useState<any>([]);
  const [dataFilter, setDataFilter] = useState<any>([]);
  const [OutleID, setOutletID] = useState<any>(0);
  const [TableID, setTableID] = useState<any>(0);


  const [pkg, setPkg] = useState<any>("");

  useEffect(() => {
    getItem(params).then((data) => {
      setOutletID(data.OutletID);
      setTableID(data.TableID);
      setData(data.items);
      setPkg(data.Package);
     });
  }, []);

  useEffect(() => {

  }, [data]);


  
  // useEffect(() => {
  //   getOrder().then((data) => {
  //     setOrder(data.orders);
  //     console.log(data.orders);
  //   })
  // }, []);

  // useEffect(() => {
  //   console.log(order);
  // }, [order]);

  
  // FILTER DATA
  useEffect(() => {
    const sushi = data.filter((item: any) => {
      return isSushi.includes(item.ItemCode);
    });
    const beef = data.filter((item: any) => {
      return isBeef.includes(item.ItemCode);
    });
    const seafood = data.filter((item: any) => {
      return isSeafood.includes(item.ItemCode);
    });
    const desert = data.filter((item: any) => {
      return isDesert.includes(item.ItemCode);
    });
    const vegeis = data.filter((item: any) => {
      return isVegeis.includes(item.ItemCode);
    });
    const noodle = data.filter((item: any) => {
      return isNoodle.includes(item.ItemCode);
    });
    setDataNoodle(noodle);
    setDataVegeis(vegeis);
    setDataDesert(desert);
    setDataSeafood(seafood);
    setDataBeef(beef);
    setDataSushi(sushi);
   
    setDataFilter([...dataSushi, ...dataBeef, ...dataSeafood, ...dataVegeis, ...dataNoodle, ...dataDesert,]);
  }, [data, ...dataSushi, ...dataBeef, ...dataSeafood, ...dataVegeis, ...dataNoodle, ...dataDesert,]);



  const [cart, setCart] = useState<any>([]);

  useEffect(() => {
    let cart_local = localStorage.getItem("cart");
     if(cart_local){
      setCart(JSON.parse(cart_local!));
      // console.log(cart_local);   
    }
  },[]);

  const addToCart = (item :any, countItem:any) => {
  setCart((prevCart: any[])  => {
     const existingItemIndex = prevCart.findIndex(cartItem => cartItem.ItemCode === item.ItemCode);

    if (existingItemIndex >= 0) {
       const updatedCart = [...prevCart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        Quantity: updatedCart[existingItemIndex].Quantity + countItem
      };
      return updatedCart;
    } else {
       let newItem = {
        'OutletID': OutleID,
        'TableID': TableID,
        'ItemID': item.ItemID,
        'ItemCode': item.ItemCode,
        'ItemSupp': item.Name,
        'UnitPrice': item.UnitPrice,
        'Disc': item.Disc,
        'Size': item.Size,
        'SvcExcl': item.SvcExcl,
        'TaxExcl': item.TaxExcl,
        'GrpMaster': item.GrpMaster,
        'GrpSub': item.GrpSub,
        'Quantity': countItem,
        // 'CashierID': 1,
      };
      return [...prevCart, newItem];
    }
    });
  };
  
  useEffect(() => {
    if(cart.length > 0){
      localStorage.setItem("cart", JSON.stringify(cart!));
    }
  }, [cart]);
  

  const [page, setPage] = useState<any>(1);
  const [overlay, setOverlay] = useState<any>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [countItem, setCountItem] = useState(1);



  const handleItemClick = (item : any) => {
    setSelectedItem(item);
    setOverlay(true);
  };
  

  const [activeCategory, setActiveCategory] = useState('');
  const sushiRef = useRef(null);
  const beefRef = useRef(null);
  const seafoodRef = useRef(null);
  const desertRef = useRef(null);
  const vegeisRef = useRef(null);
  const noodleRef = useRef(null);

 
  const [overlay5 , setOverlay5] = useState(false);


  const Menu = () => {
    // {"_id":"655fb378b07c32a55a5e0ba3","ItemID":"8869","Disc":"N","GrpMaster":"7","GrpSub":"704","ItemCode":"70406","Name":"C เนื้อริบอาย (กก)","SvcExcl":"X","TaxExcl":"Y","UnitPrice":""}
   
    const checkCategoryInView = () => {
      const checkRefInView = (ref:any, category:any) => {
        if (ref.current) {
          const pos = ref.current.getBoundingClientRect();
          if (pos.top >= 0 && pos.bottom <= (window.innerHeight/2 )) {
            setActiveCategory(category);
          }
        }
      };
  
      checkRefInView(sushiRef, 'sushi');
      checkRefInView(beefRef, 'beef');
      checkRefInView(seafoodRef, 'seafood');
      checkRefInView(vegeisRef, 'vegies');
      checkRefInView(noodleRef, 'noodle');
      checkRefInView(desertRef, 'desert');
    };
  
    useEffect(() => {
      window.addEventListener('scroll', checkCategoryInView);
      return () => {
        window.removeEventListener('scroll', checkCategoryInView);
      };
    }, []);

    const scrollToCategory = (ref:any) => {
      if (ref.current) {
        const pos = ref.current.getBoundingClientRect();
        console.log(pos);
        // const category = ref.current.id;
        // if (pos.top >= 0 && pos.bottom <= (window.innerHeight/2 )) {
        //   setActiveCategory(category);
        // }
        window.scrollTo({
          top: pos.top + window.scrollY - 100,
          behavior: 'smooth',
        });
      }
    };
    
    return (
      <> 
      <nav>
      <div onClick={() => scrollToCategory(sushiRef)} className={activeCategory === 'sushi' ? 'active' : ''}>ซูชิ</div>
        <div onClick={() => scrollToCategory(beefRef)} className={activeCategory === 'beef' ? 'active' : ''}>เนื้อสัตว์</div>
        <div onClick={()=> scrollToCategory(seafoodRef)} className={activeCategory === 'seafood' ? 'active' : ''}>ทะเล</div>
        <div onClick={()=> scrollToCategory(vegeisRef)} className={activeCategory === 'vegies' ? 'active' : ''}>ผัก</div>
        <div onClick={()=> scrollToCategory(isNoodle)} className={activeCategory === 'noodle' ? 'active' : ''}>เส้น</div>
        <div onClick={()=> scrollToCategory(desertRef)} className={activeCategory === 'desert' ? 'active' : ''}>ของหวาน</div>
       </nav>
       <section>     
        {dataFilter.map((item:any, index :any) => (          
           <>
            <div ref={isSushi.includes(item.ItemCode) 
              ? sushiRef : isBeef.includes(item.ItemCode) 
              ? beefRef : isSeafood.includes(item.ItemCode) 
              ? seafoodRef : isVegeis.includes(item.ItemCode) 
              ? vegeisRef : isNoodle.includes(item.ItemCode) 
              ? noodleRef : isDesert.includes(item.ItemCode) 
              ? desertRef : null
            }
              ></div>
            <button 
            className="item"
            key={index} 
            onClick={() => handleItemClick(item)}>
            <div className="v2">
            <img src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${item.ItemCode}.jpg`} alt="Imgfood" />
            <div className="title"><p>{item.Name}</p><p>0.00฿</p></div>
            </div>
            <button className="but-ton">+</button>
          </button>
           </> 
        ))}
       {overlay && selectedItem && (
          <div className="overlay">
            <div className="modal">
            <div className="modal-header">
              <div className="name">{selectedItem.Name}</div>
            </div>
            <div className="modal-body">
              <div className="modal-img">
                <img src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${selectedItem.ItemCode}.jpg`}  alt="Imgfood" />
              </div>
              <div className="item-count">
              <button className="count-btn" onClick={() => setCountItem(prevCount => prevCount >1 ? prevCount - 1 : 1)}>-</button>
                <span>{countItem}</span>
                <button className="count-btn" onClick={() => setCountItem(prevCount => prevCount + 1)}>+</button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-action" onClick={() => [setOverlay(false), setCountItem(1)]}>ยกเลิก</button>
              <button className="modal-action" onClick={() => [ setOverlay(false), addToCart(selectedItem, countItem), setCountItem(1)]}>เพิ่มในตะกร้า</button>
            </div>
          </div>
          </div>
        )}
        {overlay5 && cart.length > 0  &&(
              <div className="dialog-overlay">
              <div className="dialogv2">
                <p>คุณมีสินค้าอยู่ในตะกร้า และ <br/> ยังไม่ได้กดสั่งอาหาร?</p>
                <div className="rowd">
                </div>
                <div className="dialog-actionsv2">
                   <button onClick={()=>[
                        setOverlay5(false),
                  ]}>ตกลง</button>
                </div>
              </div>
            </div>              
            )}
      </section>
      </>
    );
  }


  const [overlay3, setOverlay3] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any>(null);
  const [overlay4 , setOverlay4] = useState(false);

  const Cart = () => {
    const incrementQuantity = (itemCode:any) => {
      setCart(cart.map((item: { ItemCode: any; Quantity: number; }) => 
        item.ItemCode === itemCode ? { ...item, Quantity: item.Quantity + 1 } : item
      ));
    };
  
    const decrementQuantity = (itemCode:any) => {
      setCart(cart.map((item:any) =>
        item.ItemCode === itemCode ? { ...item, Quantity: item.Quantity - 1 } : item
      ).filter((item:any) => item.Quantity > 0));
    };
  
    const confirmAndRemoveItem = (itemCode:any) => {
      const item = cart.find((item :any)=> item.ItemCode === itemCode);
      if (item) {
        setItemToRemove(item); // Store the entire item object
        setOverlay3(true);
      }
    };
  
    const handleRemoveConfirmed = () => {
      if (itemToRemove) {
        setCart(cart.filter((item:any) => item.ItemCode !== itemToRemove.ItemCode));
      }
      setOverlay3(false);
      setItemToRemove(null);  
    };
  
    return (
      <>
      <div className="header-page2">
        <button onClick={() => [setPage(1), setOverlay5(true)]}>x</button>
       <div> <h1>ตะกร้า</h1> <p>ข้อมูล ณ เวลา {(new Date()).toLocaleTimeString()}</p></div>
        </div>
  <div className="cart-container">
    {cart.map((item:any, index :any) => (
          <button 
            className="itemv2" 
            key={index} >
            <div className="v2">
            <img src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${item.ItemCode}.jpg`} alt="Imgfood" />
            <div className="title"><p>{item.ItemSupp}</p><p>0.00฿</p></div>
            </div>
            <div className="cart-body">
            <div className="quantity-controls">
            <button onClick={() => item.Quantity === 1 ? confirmAndRemoveItem(item.ItemCode) : decrementQuantity(item.ItemCode)} aria-label="Decrease quantity">-</button>
              <span>{item.Quantity}</span>
              <button onClick={() => incrementQuantity(item.ItemCode)} aria-label="Increase quantity">+</button>
            </div>
          </div>
          </button>
          
        ))}
            {overlay3  && itemToRemove && (
              <div className="dialog-overlay">
                <div className="dialog">
                  <p>คุณต้องการยกเลิกเมนูนี้ใช่หรือไม่?</p>
                  <div className="rowd">
                  <img src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${itemToRemove.ItemCode}.jpg`} alt="Item Image" />
                  <p>{itemToRemove.ItemSupp} <br/> ราคา: {itemToRemove.UnitPrice != "" ? itemToRemove.UnitPrice : 0 }฿</p>
                  </div>
                  <div className="dialog-actions">
                    <button onClick={() => setOverlay3(false)}>ยกเลิก</button>
                    <button onClick={handleRemoveConfirmed}>ตกลง</button>
                  </div>
                </div>
              </div>
            )}
            {overlay4 && (
              <div className="dialog-overlay">
              <div className="dialog">
                <p>คุณต้องการสั่งอาหารทั้งหมดนี้ใช่หรือไม่?</p>
                <div className="rowd">
                </div>
                <div className="dialog-actions">
                  <button onClick={() => setOverlay4(false)}>ยกเลิก</button>
                  <button onClick={()=>[
                       postItem(cart),
                        setCart([]),
                        setOverlay4(false),
                  ]}>ตกลง</button>
                </div>
              </div>
            </div>              
            )}
  </div>
  {}
</>
    );
  };
  

  const Order = () => {
    return (
      <>
        <nav className="header-page2">
          <button onClick={() => setPage(1)}>x</button>
        <div> <h1>รายการที่สั่ง</h1> <p>ข้อมูล ณ เวลา {(new Date()).toLocaleTimeString()}</p></div>
          </nav>
        {order.map((item:any, index :any) => (
          
          <button 
            className="itemv2" 
            key={index} >
            <div className="v2">
            <img src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${item.ItemCode}.jpg`} alt="Imgfood" />
            <div className="title"><p>{item.ItemSupp}</p><p>0.00฿</p></div>
            </div>
            <button className="but-tonv2"><p>{new Date(item.PostTime).toLocaleString()}</p></button>
          </button>
        ))}
      </>
    );
  }

  // {
  //   'OutletID': '1.10',
  //   'TableID': '14',
  //   'ItemID': data2.ItemID,
  //   'ItemCode': data2.ItemCode,
  //   'ItemSupp': data2.Name,
  //   'UnitPrice': data2.UnitPrice,
  //   'Disc': data2.Disc,
  //   'Size': '1',
  //   'SvcExcl': data2.SvcExcl,
  //   'TaxExcl': data2.TaxExcl,
  //   'GrpMaster': data2.GrpMaster,
  //   'GrpSub': data2.GrpSub,
  //   'Quantity': quanity,
  //   'CashierID': '1',
  // },
  const isPage = () => {
    {if(page == 1){
      return <Menu />
    }
    else if(page == 2){
      return <Cart />
    }
    else if(page == 3){
     
      return <Order />
    }
    }
  }

  const isChanged = (e: any) => {
    console.log(e.target.id);
    if(e.target.id == "menu"){
      return setPage(1);
    }
    else if(e.target.id == "cart"){
      return setPage(2);
    }
    else if(e.target.id == "order"){
      getOrder(TableID,OutleID).then((orderData) => {
        setOrder(orderData.orders);
        console.log(order);
      }).catch(error => {
        console.error('Error fetching order data:', error);
      });

      return setPage(3);
    }
  }

  // < Navbar />
  const isHeader = () => {
    if(page == 1){
      return(
      <>
        <button className="ord-header">โต๊ {TableID} | คุณ N</button>
        <div className="order-list">
        <button id="order" onClick={()=>{   
        getOrder(TableID,OutleID).then((orderData) => {
        setOrder(orderData.orders);
        // console.log(order);
      }).catch(error => {
        console.error('Error fetching order data:', error);
      });setPage(3)}}>
        <img src="cooking.png"/></button>
        </div>
       <img src={`https://posimg.s3.ap-southeast-1.amazonaws.com/header.jpg`} alt="logo" />
      </>
       
      )
    }else if(page == 2){
      return <></>
    }else if(page == 3){
      return <></>
    }
  }


 const isBar = () => {
  if(page == 1 && cart.length > 0){
    return(
    <footer>
     <div className="cart-orderv2">
      <button id="cart" onClick={isChanged}> รายการในตะกร้า {cart.length} รายการ</button>
      </div>
      </footer>
    )
  }
  else if(page == 2 && cart.length > 0){
    return(
      <footer>
      <div className="cart-order">
      <button onClick={() =>[
        setOverlay4(true),
        // postItem(cart),
        // setCart([]),
        localStorage.removeItem("cart"),
      ]}>สั่ง {cart.length} รายการ</button>
      </div>
      </footer>
      
    )
  } else if(page == 3){
    return(
      <div className="total-price"><p>ราคาทั้งหมด</p><p>0.00฿</p></div>
    )
  }
 }

  const isFooter = () => {
    return(
      <>
      <button id="menu" onClick={isChanged}>Menu</button>
      <button id="cart" onClick={isChanged}>Cart</button>
      <button id="order" onClick={isChanged}>Order</button>
      </>
    )
  }

  return (
    <>
     <header className={page === 1 ? "p1" : "p2"}>
     {isHeader()}
     </header>
     <div className="main-content">
     {isPage()}
     </div>
     {isBar()}
     {/* <footer>
     {isFooter()}    
     </footer> */}
    </>
  );
}