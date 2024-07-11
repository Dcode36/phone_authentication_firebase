// src/OtpLogin.js
import React, { useState } from 'react';
import { auth } from './firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import Swal from 'sweetalert2'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import './App.css'
const OtpLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState("+");
    const [otp, setOtp] = useState('');
    const [verificationId, setVerificationId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
    // const [loading, setLoading] = setLoading(true);

    const handleSendOtp = async () => {
        try {
            const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved - will proceed with submit
                    handleSignInWithPhoneNumber();
                },
                'expired-callback': () => {
                    // Response expired - handle it here
                    console.log('reCAPTCHA token expired');
                }
            });
            setRecaptchaVerifier(verifier);
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier)
            setVerificationId(confirmation);
        } catch (err) {
            console.log(err)
        }
    };
    const handleSignInWithPhoneNumber = async () => {
        try {
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
            setVerificationId(confirmation);
        } catch (error) {
            console.log(error);
        }
    };
    const handleVerifyOTP = async () => {
        try {
            const response = await verificationId.confirm(otp);
            if (response && response.user) {
                Swal.fire({
                    title: "Good job!",
                    text: "User ${response.user.phoneNumber} successfully logged in!",
                    icon: "success"
                });

                setSuccessMessage("User Logged Succesfully")

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Invalid OTP. Please try again.",
                });
            }
        } catch (error) {
            console.log(error);
            setSuccessMessage('Error verifying OTP. Please try again.');
        }
    };

    console.log("phene" + phoneNumber)
    return (
        <>
            <div className='container'>
                <div className="form">
                    <h2>Phone Authentication</h2>
                    <PhoneInput
                        country={'in'}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber("+" + e)}
                    />
                    {
                        verificationId ?
                            <>
                                <p>OTP sent to above mobile number</p>
                            </>
                            :
                            <>
                                <button onClick={handleSendOtp}>
                                    <p>Send OTP</p>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        ></path>
                                    </svg></button>
                            </>
                    }

                    <div id="recaptcha-container"></div>

                    {verificationId && (
                        <>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                            />
                            <button onClick={handleVerifyOTP}>
                                <p>Verfy OTP</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="4"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    ></path>
                                </svg></button>
                        </>
                    )}
    
                    {successMessage && <p>{successMessage}</p>}
                </div>
            </div>
        </>
    );
};

export default OtpLogin;
