/*-------------------------------------------------------------------
|  🐼 Function isFormInvalid
|
|  🐯 Purpose: CHECKS IF FORM IS VALID OR NOT
|
|  🐸 Returns:  OBJECT
*-------------------------------------------------------------------*/

export const isFormInvalid = err => {
  return Object.keys(err).length > 0;
}
