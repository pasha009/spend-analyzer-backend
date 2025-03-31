const Footer = () =>{
    return(
        <footer className='bottom-0 mt-6 mb-8'>
            <div className='max-w-5xl mx-auto px-5 flex justify-between items-center gap-4'>
                <p className='text-sm'>
                    Expense App &copy; {new Date().getFullYear()}
                </p>
                <div className='text-sm'>
                    Created using Next.js
                </div>
            </div>
        </footer>
    )
}
export default Footer;
