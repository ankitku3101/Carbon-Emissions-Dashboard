import React from 'react'

function Landing() {
  return (
    <div 
        className='min-h-screen flex items-center justify-center' 
        style={{
            backgroundImage: `url(${'/hero.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
         }}>
        <h1 className='text-center text-[54px] md:leading-[60px] font-bold tracking-tight'>Emissions Data Management <br/> and Analysis</h1>
    </div>
  )
}

export default Landing