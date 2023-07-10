

export const FormInput = ({ input, value, onChange}) => {
    const handleChange = (e) => {
      const value = e.target.value;
      onChange(value);
    };
  
    let inputElement = null;
    let labelText = null;
    
  
    switch (input) {
        case 'text':
            labelText = <label htmlFor="name">Name</label>;
            inputElement = <input type="text" className="form-control" value={value} onChange={handleChange} placeholder="Enter name" />;
            break;
        case 'email':
            labelText = <label htmlFor="email">Email</label>;
            inputElement = <input type="email" className="form-control" value={value} onChange={handleChange} placeholder="Enter email"/>;
            break;
        case 'password':
            labelText = <label htmlFor="password">Password</label>;
            inputElement = <input type="password" className="form-control" onChange={handleChange} placeholder="Enter pass"/>;
            break;
        case 'confirmPassword':
            labelText = <label htmlFor="password">Confirm Password</label>;
            inputElement = <input type="password" className="form-control" onChange={handleChange} placeholder="Confirm pass"/>;
            break;
        default:
            inputElement = <input type="text" className="form-control" value={value} onChange={handleChange} />;
            break;
    }
  
    return (
        <div>
            <div className="mb-2">
                {labelText}
                {inputElement}
            </div>
        </div>
    )
};