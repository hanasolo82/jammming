

export default function SearchBar(props) {

    return (
        <div className='searchbar-container'>
          <input 
            className='input-search' 
            placeholder='lucky day'
            name={props.inputName}
            type={props.typeInput}
            onChange={props.onChangeInput}
            value={props.valueInput}
          />
          <br/>
          <button 
            className='button-search'
            onClick={props.handleIsClicked}
            >Search</button>
        </div>
    )

}