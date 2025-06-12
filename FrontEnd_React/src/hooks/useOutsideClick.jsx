import { use } from "react";
import { useEffect} from "react";

function useOutsideClick(ref, handler, active = true) {
    useEffect(() => {
        if(!active) return;

        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };

        document.addEventListener("mousedown", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
        };
    }, [ref, handler, active]);
}

export default useOutsideClick;