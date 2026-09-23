import React, { useState } from 'react';
import './UserCreationForm.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; 
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { API_URL } from './api';

const UserCreationForm = ({ onBack }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        user_name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePhoneChanges = (value) => {
        setFormData({
            ...formData,
            phoneNumber: value,
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
   
            const data = await response.json();
            if (response.ok) {
                setResponseMessage(`User created successfully: ${data.full_name}. You can log in now.`);
            } else {
                setResponseMessage(data.message);
            }
        } catch (error) {
            setResponseMessage('Server error, please try again later.');
        }
    };

    return (
        <div id="form1">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="full_name">Full Name:</label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="user_name">User Name:</label>
                    <input
                        type="text"
                        id="user_name"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                {/* Password input and toggle icon inside a container */}
                <div className="password-container">
                    <label htmlFor="password">Password:</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        onClick={togglePasswordVisibility}
                        className="eye-icon"
                    />
                </div>

                <div>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <PhoneInput
                        id="phoneNumber"
                        country={'us'}
                        value={formData.phoneNumber}
                        onChange={handlePhoneChanges}
                        inputStyle={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                </div>
                <button id="submit" type="submit">Register</button>
            </form>

            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default UserCreationForm;
