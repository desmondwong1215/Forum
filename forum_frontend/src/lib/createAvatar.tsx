// get a colour for username
function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
// get the design the avatar
export function stringAvatar(name: string) {
    let newName: string;
    let splitName: string[] = name.split(' ');
    newName = splitName[0][0];
    if (splitName.length > 1) {
        newName = newName.concat(splitName[1][0]);
    } else if (name.length > 1) {
        newName = newName.concat(splitName[0][1]);
    }
    return {
        sx: {
        bgcolor: stringToColor(name),
        },
        children: newName.toUpperCase(),
    };
}
  