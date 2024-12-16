import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function HomePage() {
    const navigate = useNavigate();

    const createRoom = () => {
        const roomId = uuidv4(); // Generate a unique room ID
        navigate(`/${roomId}`);
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <button
                onClick={createRoom}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg"
            >
                Create a Room
            </button>
        </div>
    );
}

export default HomePage;
