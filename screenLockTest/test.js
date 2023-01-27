import React from "react";
import { View, Button } from "react-native";
import lockDetection from "./src/api/screenlockDetection";
let screenLock = "unk";

function App() {
  return (
    <View>
      <Button
        onPress={async () => {
          let res = await lockDetection();
          screenLock = res;
          console.log("screenLock:", res);
        }}
        title="Press to see if screen locks"
      />
    </View>
  );
}

export default App;