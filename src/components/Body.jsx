import React, { useEffect, useState } from 'react'
import { copy, linkIcon, loader, tick } from "../assets";

const Body = () => {
  
   const rapidApiKey=import.meta.env.VITE_RAPID_AI_KEY;

    const [article,setArticle]=useState({
        url:"",
        summary:""
    });

    const [allArticle,setAllArticle]=useState([]);

    const [isLoading,setIsLoading]=useState(false);
    
    const [copied,setCopied]=useState('');


       useEffect(()=>{
       const dataFromLocalStorage=JSON.parse(localStorage.getItem("articles"));

       if(dataFromLocalStorage){
        setAllArticle(dataFromLocalStorage);
       }


       },[]);



    const handleSubmit= async(e)=>{
          e.preventDefault();
          setIsLoading(true);
          const {url}=article;
          console.log(url,"i am the saved url")

          const apiUrl = `https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${encodeURIComponent(url)}&length=5`

          const result= await fetch(apiUrl,{
            method:"GET",
            headers:{
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'article-extractor-and-summarizer.p.rapidapi.com'
              },

          });

          const data=await result.json();
          if(data?.summary){

            const newArticle={...article,summary:data.summary};
            const updatedAllArticles=[newArticle,...allArticle];

                setArticle(newArticle);
                setAllArticle(updatedAllArticles);
                setIsLoading(false);
               localStorage.setItem("articles",JSON.stringify())
               console.log(data.summary,"i am the data from ai");

          }
          setTimeout(()=>{
              setIsLoading(false);
              
          },20000)
    }

    const handleChange=(e)=>{
         setArticle({...article,url:e.target.value});
         
    }


    const handleCopy = (copyUrl) => {
      setCopied(copyUrl);
      navigator.clipboard.writeText(copyUrl);
      setTimeout(() => setCopied(false), 3000);
    };




  return (
    <section className='mt-16 w-full max-w-xl'>
    <div className='flex flex-col w-full gap-2'>
    <form
      className='relative flex justify-center items-center'
      onSubmit={handleSubmit}
    >
      <img
        src={linkIcon}
        alt='link-icon'
        className='absolute left-0 my-2 ml-3 w-5'
      />

      <input
        type='url'
        placeholder='Paste the article link'
        value={article.url}
        onChange={handleChange}
        //onKeyDown={handleKeyDown}
        required
        className='url_input peer' 
      />
      <button
        type='submit'
        className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 '
      >
        <p>↵</p>
      </button>
    </form>

     
     
             <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
            {allArticle.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className='link_card'
            >
              <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt={copied === item.url ? "tick_icon" : "copy_icon"}
                  className='w-[40%] h-[40%] object-contain'
                />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

  

     <div className='my-10 max-w-full flex justify-center items-center'>
        {isLoading ? (
          <img src={loader} alt='loading....' className='w-20 h-20 object-contain' />
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                Article <span className='blue_gradient'>Summary</span>
              </h2>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-700'>
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
     </div>



    
    </section>
  )
}

export default Body;