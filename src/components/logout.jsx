import React from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser, clearAuthUser } from '../features/authSlice';

function Logout() {
    const authUser = useSelector(selectAuthUser);
    const dispatch = useDispatch();

    const handleLogout = () => {
        try {
            console.log("Before logout:", authUser); // Log the user before logout
            dispatch(clearAuthUser()); // Dispatch the clearAuthUser action
            toast.success("User Logout Successfully");
            window.location.reload(); // Reload the page after logout
        } catch (err) {
            toast.error("Error: " + err.message);
        }
    };

    return (
        <div>
            <button
                className="bg-black text-white p-2 rounded-md hover:bg-slate-800 duration-150 cursor-pointer"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}

export default Logout;
