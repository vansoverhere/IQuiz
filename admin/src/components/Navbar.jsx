import React, {useEffect, useRef, useState} from 'react'
import {navbarStyles} from '../assets/dummyStyles'
import {useNavigate} from "react-router-dom"
import {useUser, useAuth, Show, UserButton, SignInButton} from '@clerk/react'
import { Home, List, Menu, User,X } from 'lucide-react';


const Navbar = ({logoSrc=null, siteName="IQuiz", rightContent=null,onNavigate=null}) => {

    const[mobileOpen,setMobileOpen]=useState(false);
    const {isSignedIn}=useUser();
    const {getToken} =useAuth();
    const navigate=useNavigate();

    const handleNavigate=(href)=>{
        setMobileOpen(false);
        if(onNavigate) return onNavigate(href);

        try{
            navigate(href);
        }catch(error){
            window.location.href=href;
        }
    }
    //to save token
    const prevSignedInRef=useRef(isSignedIn);

    useEffect(()=>{
        let mounted=true;
        async function saveTokenAndMaybeRedirect() {
            if(!isSignedIn || prevSignedInRef.current===isSignedIn) return;

            try {
                const token=await getToken();
                if(token && mounted){
                    localStorage.setItem("clerkToken",token);
                    console.log("Clerk token saved")
                }
            } catch (err) {
                console.error("Failed to get the Clerk token:",err);
            }
            const path=window.location.pathname;
            const shouldRedirect=path==="/" || path==="/login" || path==="/signin" || path==="";

            if(shouldRedirect){
                if(onNavigate) onNavigate("/dashboard");
            else{
                try {
                    navigate("/dashboard");
                } catch {
                    window.location.href="/dashboard";
                }
            }
        }
        prevSignedInRef.current=isSignedIn;
    }
    saveTokenAndMaybeRedirect();
    return ()=>{
        mounted=false;
    }
    },[isSignedIn, getToken,navigate,onNavigate])
  return (
    
      <nav className={navbarStyles.nav}>
        <div className={navbarStyles.container}>
            <div className={navbarStyles.innerContainer}>
                <div className={navbarStyles.homeButton}>
                    <button type='button' onClick={()=> handleNavigate("/dashboard")} className={navbarStyles.homeButton}
                    >
                        <div className={navbarStyles.logoWrapper}>
                            <img src={
                    logoSrc ||
                    "https://cdn-icons-png.flaticon.com/128/5806/5806364.png"
                  }
                  alt={`${siteName} logo`}
                  className={navbarStyles.logoImg} />
                        </div>
                        <div className={navbarStyles.siteNameWrapper}>
                            <span className={navbarStyles.siteName}>
                                {siteName}
                            </span>
                            <span className={navbarStyles.siteSubtitle}>
                                Learning Platform
                            </span>

                        </div>
                    </button>
                </div>

                <Show when="signed-in">
                 <div className={navbarStyles.desktopCenterContainer}>
                    <div className={navbarStyles.desktopCenterInner}>
                        <button onClick={()=> handleNavigate("/dashboard")}
                        className={navbarStyles.dashboardButton}>
                            <Home className={navbarStyles.dashboardIcon}/>
                            <span className={navbarStyles.dashboardText}>Dashboard</span>
                        </button>

                        <button onClick={()=> handleNavigate("/list")} className={navbarStyles.listButton}>
                            <List className={navbarStyles.listIcon} />
                            <span className={navbarStyles.listText}>List Quiz</span>

                        </button>


                    </div>

                 </div>
                </Show>  
                <div className="flex items-center gap-3">
                    <div className={navbarStyles.desktopRightContent}>
                        {rightContent? (
                            rightContent
                        ):(
                            <div className={navbarStyles.profileGroup}>
                                <Show when="signed-out">
                                  <SignInButton mode="modal">
                                    <button type="button"className={navbarStyles.profileButton}>
                                        <User className={navbarStyles.profileIcon}/>
                                        <span>My Profile</span>
                                    </button>
                                    
                                  </SignInButton>  
                                </Show>

                                <Show when="signed-in">
                                    <div className={navbarStyles.profileGroup}>
                                        <div className={navbarStyles.profileBlur}/>
                                        <UserButton appearance={{elements:{avatarBox:"w-9 h-9"}}}/>
                                    </div>
                                </Show>
                            </div>
                        )}
                    </div>
                    <div className={navbarStyles.mobileMenuContainer}>
                        <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setMobileOpen((s) => {
                            return !s;
                            });
                        }}
                        className={navbarStyles.hamburgerButton}
                        >
                            {mobileOpen?(
                                <X className={navbarStyles.xIcon}/>
                            ):(
                                <Menu className={navbarStyles.menuIcon}/>
                            )}
                        </button>
                    </div>
                </div>

            </div>

        </div>
        {mobileOpen && (
            <div id="mobile-menu" className={navbarStyles.mobileOverlay}>
                <div onClick={()=>setMobileOpen(false)} className={navbarStyles.mobileBackdrop}/>
                
                <div className={navbarStyles.mobilePanel} onClick={(e)=>e.stopPropagation()}>
                    <nav className={navbarStyles.mobileNav}>
                        <Show when="signed-in">
                            <button onClick={()=>handleNavigate("/dashboard")} className={navbarStyles.mobileNavButton}>
                                <Home className={navbarStyles.mobileNavIcon}/>

                                <div>
                                    <div className={navbarStyles.mobileNavItemTitle}>Dashboard</div>
                                </div>
                            </button>
                            <button onClick={()=>handleNavigate("/list")} className={navbarStyles.mobileNavButton}>
                                <List className={navbarStyles.mobileNavIcon}/>
                                <div>
                                    <div className={navbarStyles.mobileNavItemTitle}>
                                        List Quiz
                                    </div>
                                </div>

                            </button>

                        </Show>
                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <button className={navbarStyles.mobileNavButton}>
                                    <User className={navbarStyles.mobileNavIcon}/>
                                    <div>
                                        <div className={navbarStyles.mobileNavItemTitle}>Login</div>
                                    </div>
                                </button>
                            </SignInButton>

                        </Show>

                        <Show when="signed-in">
                            <div className={navbarStyles.mobileNavButton}>
                                <UserButton/>
                            </div>
                        </Show>
                    </nav>
                </div>
            </div>
        )}

      </nav>
    
  )
}

export default Navbar
