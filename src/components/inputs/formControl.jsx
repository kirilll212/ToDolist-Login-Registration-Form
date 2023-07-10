export const FormInput = ({ input, validate, name, value, onChange, error}) => {
    const handleChange = (e) => {
      const value = e.target.value;
      onChange(value);
    };
  
    let inputElement = null;
  
    switch (input) {
        case 'text':
            inputElement = <input type="text" className="form-control" value={value} onChange={handleChange} placeholder="Enter name" />;
            break;
        case 'email':
            inputElement = <input type="email" className="form-control" value={value} onChange={handleChange} placeholder="Enter email"/>;
            break;
        case 'password':
            inputElement = <input type="password" className="form-control" onChange={handleChange} placeholder="Enter pass"/>;
            break;
        case 'confirmPassword':
            inputElement = <input type="password" className="form-control" onChange={handleChange} placeholder="Confirm pass"/>;
            break;
        default:
            inputElement = <input type="text" className="form-control" value={value} onChange={handleChange} />;
            break;
    }
  
    return (
        <div>
            <div className="mb-2">
                {inputElement}
            </div>
        </div>
    )
};