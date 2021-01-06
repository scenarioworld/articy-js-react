# articy-node-react

React components and hooks to use with [articy-node](https://www.npmjs.com/package/articy-node).

## Components

```js

// In order for these components to work, they must be inside a DatabaseProvider with an Articy Database set (see the articy-node package)
<DatabaseContext.Provider value={db}></DatabaseContext.Provider>

// Prints the text contained in a flow node, automatically formatting into paragraphs, line breaks, bold/italics, etc.
<FlowText flowId="0x0000232" /> 

// Outputs an <img> tag with the preview image for a given entity
<EntityAvatar entityId="0x000343" />

// Or, if you have the asset ID of the image you want to display, just use ImageAsset
<ImageAsset id="0x000343" />

// Dirty table debug display of all values in a variable store. Useful for debugging screens.
<VariableDebugView store={variableStore} />

```

## Hooks

```js

// These hooks will only work if called from components inside a <DatabaseContext.Provider> (see above)

// Use the active database
const result = useDatabase(db => /* some function using the database */, [deps...]);

// Get an object from the database
const pin = useDatabaseObject("0x0000343", InputPin);

// Resolve all branches from a brach list but only return those that end in a DialogueFragment
const dialogueBranches = useBranches(state.branches, DialogueFragment);

```