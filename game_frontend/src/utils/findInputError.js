/*-------------------------------------------------------------------
|  🐼 Function findInputError
|
|  🐯 Purpose: GIVEN AN ERRORS OBJECT AND AN INPUT NAME, THIS FUNCTION
|              FILTERS THE ERRORS OBJECT AND RETURN THE ERROR OF THE 
|              GIVEN INPUT.
|
|  🐸 Returns:  OBJECT
*-------------------------------------------------------------------*/

export function findInputError(errors, name) {
    return Object.keys(errors)
      .filter(key => key.includes(name))
      .reduce((cur, key) => {
          return Object.assign(cur, {error: errors[key]})
      }, {})
}
