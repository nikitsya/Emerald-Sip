import React from "react"
import {Link} from "react-router-dom"
import {Button} from "./Button"

export const ProductFormFields = ({formValues, onFieldChange, submitLabel, onSubmit}) => (
    <form>
        <label>Name</label>
        <input autoFocus type="text" name="name" value={formValues.name} onChange={onFieldChange(`name`)}/>

        <label>Price</label>
        <input type="text" name="price" value={formValues.price} onChange={onFieldChange(`price`)}/>

        <label>Images (comma separated)</label>
        <input type="text" name="images" value={formValues.images} onChange={onFieldChange(`images`)}/>

        <label>Description</label>
        <input type="text" name="description" value={formValues.description}
               onChange={onFieldChange(`description`)}/>

        <label>Capacity (ml)</label>
        <input type="number" name="capacityMl" value={formValues.capacityMl} onChange={onFieldChange(`capacityMl`)}/>

        <label>Material</label>
        <input type="text" name="material" value={formValues.material} onChange={onFieldChange(`material`)}/>

        <label>Color</label>
        <input type="text" name="color" value={formValues.color} onChange={onFieldChange(`color`)}/>

        <Button value={submitLabel} className="green-button" onClick={onSubmit}/>
        <Link className="red-button" to={"/DisplayAllProducts"}>Cancel</Link>
    </form>
)
