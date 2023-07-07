import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "../Validation/config"

export const Input = (props) => {
    return (
        <div>
            <input onChange={props.validate} type="text" placeholder={props.placeholder}/>
        </div>
    )
}