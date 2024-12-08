import { User } from "@/lib/storage";
import { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export const UserModal = ({
  visible,
  onSubmit,
}: {
  visible: boolean;
  onSubmit: (user: User) => void;
}) => {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    if (!name || !rollNo) {
      setError("Please fill in all fields");
      return;
    }
    if (!parseInt(rollNo)) {
      setError("Roll number must be a number");
      return;
    }

    onSubmit({ name, rollNo });
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            Who are you?
          </Text>

          <View style={styles.modalField}>
            <Text>
              Name
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder="John Doe"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.modalField}>
            <Text>
              Roll number
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={setRollNo}
              value={rollNo}
              placeholder="Roll number"
              placeholderTextColor="#888"
            />
          </View>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalField: {
    width: '100%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: "red",
    width: "100%",
    marginBottom: 10
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '48%',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    marginLeft: "auto"
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  openDialogButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});