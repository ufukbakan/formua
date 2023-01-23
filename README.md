<h1 align="center">Formua</h1>
<h2 align="center">React Stateless Validations</h2>

## Getting Started
### Installation
```
npm i formua
```

### Interface
```ts
function Formua(params: FormuaParams /*OPTIONAL*/ ): FormuaResult;

type FormuaParams = {
    form: HTMLFormElement, // OPTIONAL: Specifies form element explicitly
    validations: ValidationMap, // OPTIONAL: Validations per input name
    transforms: TransformationMap, // OPTIONAL: Transformations per input name
}

type FormuaResult = {
    formData: FormData, // Returns transformations applied form data
    pureData: FormData, // Returns pure form data
    formErrors: Record<string, string>, // Returns error messages of each invalid input field
    isFormValid: boolean // Returns true if all fields are valid otherwise false
}

// FormData is completely immutable
type FormData = {
    data: Record<string, any>; // same as getAll()
    get(key): any;
    getAll(): Record<string, any>;
    has(key): boolean;
    set(key, value): FormData; // returns a new form data with updated key:value, also can be used as append method
    select(...keys: string[]): Record<string, any>; // returns a new form data with only selected fields
    drop(...keys: string[]): Record<string, any>; // returns a new form data without specified fields
    keys(): string[];
    values(): any[];
    entries(): Record<string, any>;
    toString(): string;
    toJSON(): Record<string, any>;
}

type ValidationMap = {
    [fieldName: string]: Validation
}

type Validation = {
    errorMessage: string,
    validator: (o: any) => boolean
}

type TransformationMap = {
    [fieldName: string]: TransformerFunction
}

interface TransformerFunction{
    (o: any) => any
}

```

### Simple Usage
If you have only single form in the page, formua will automatically detect it and retrieve data from it. A Typescript example is provided below.

```tsx
import { Formua } from "formua";
import { chainAnd, hasNoSpecialCharacters, isEmail, minLength, required } from "formua/helpers";

export default function SignupForm() {

    const { formData, pureData, formErrors, isFormValid } = Formua({
        validations: {
            username: {
                errorMessage: "Username is required and must contain no special characters",
                validator: chainAnd(required, hasNoSpecialCharacters)
            },
            email: {
                errorMessage: "Please enter your email address",
                validator: isEmail
            },
            password: {
                validator: minLength(8),
                errorMessage: "Password must be at least 8 characters long"
            }
        }
    });

    return (
        <form>
            <input name="username" placeholder="Username" />
            {formErrors.username && ( <div className="error">{formErrors.username}</div> )}
            <input name="email" placeholder="Email" />
            {formErrors.email && ( <div className="error">{formErrors.email}</div> )}
            <input type="password" name="password" placeholder="Password" />
            {formErrors["password"] && ( <div className="error">{formErrors["password"]}</div> )}
            <button disabled={isFormValid}>Sign Up</button>
        </form>
    );
}

```

### Advanced Usage
The example below shows how to use Formua to validate, transform and post a form data without any statefull input element. Typescript definitions are optional.

```tsx
import axios from "axios";
import { Formua, FormData } from "formua";
import { chainAnd, hasNoSpecialCharacters, isEmail, minLength, minTrimmedLength, sameAs, trim } from "formua/helpers";
import { useEffect, useRef } from "react";

export default function SignupForm() {

    const formRef = useRef<HTMLFormElement>(null);
    const lastData = useRef<FormData>();
    const { formData, pureData, formErrors, isFormValid } = Formua({
        form: formRef.current,
        validations: {
            username: {
                errorMessage: "Username must be at least 4 characters long and must contain no special characters",
                validator: chainAnd(minTrimmedLength(4), hasNoSpecialCharacters)
            },
            email: {
                errorMessage: "Please enter your email address",
                validator: isEmail
            },
            "email-again": {
                errorMessage: "Emails do not match",
                validator: sameAs(lastData.current?.get("email"))
            },
            password: {
                validator: minLength(8),
                errorMessage: "Password must be at least 8 characters long"
            },
            "password-again": {
                errorMessage: "Passwords do not match",
                validator: sameAs(lastData.current?.get("password"))
            }
        },
        transforms: {
            username: trim
        }
    });

    useEffect(() => {
        lastData.current = pureData;
    }, [pureData])

    function submitHandler() {
        axios.post("/signup", formData.getAll())
            .then(res => console.log("success!"))
            .catch(err => console.log("error!"));
    }

    return (
        <form ref={formRef} onSubmit={submitHandler}>
            <input name="username" placeholder="Username" />
            {formErrors.username && (<div className="error">{formErrors.username}</div>)}
            <input name="email" placeholder="Email" />
            {formErrors.email && (<div className="error">{formErrors.email}</div>)}
            <input name="email-again" placeholder="Email again" />
            {formErrors["email-again"] && (<div className="error">{formErrors["email-again"]}</div>)}
            <input type="password" name="password" placeholder="Password" />
            {formErrors["password"] && (<div className="error">{formErrors["password"]}</div>)}
            <input type="password" name="password-again" placeholder="Password again" />
            {formErrors["password-again"] && (<div className="error">{formErrors["password-again"]}</div>)}
            <button disabled={!isFormValid}>Sign Up</button>
        </form>
    );
}
```