import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';

export default function App() {
  const [menuItems, setMenuItems] = useState([
    { id: '1', name: 'Garlic Bread', description: 'Crispy bread with garlic butter', course: 'Starter', price: 45.0 },
    { id: '2', name: 'Grilled Salmon', description: 'Fresh salmon with lemon sauce', course: 'Main Course', price: 180.0 },
    { id: '3', name: 'Chocolate Cake', description: 'Rich chocolate dessert', course: 'Dessert', price: 65.0 },
  ]);

  const [nameInput, setNameInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [courseInput, setCourseInput] = useState('Main Course');
  const [priceInput, setPriceInput] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Filter Logic
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || item.course.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Statistics Calculations
  const totalItems = menuItems.length;
  const averagePrice = totalItems > 0 ? (menuItems.reduce((acc, item) => acc + item.price, 0) / totalItems).toFixed(2) : '0.00';
  const startersCount = menuItems.filter(item => item.course.toLowerCase() === 'starter').length;
  const mainCount = menuItems.filter(item => item.course.toLowerCase() === 'main course').length;
  const dessertCount = menuItems.filter(item => item.course.toLowerCase() === 'dessert').length;

  const handleSubmit = () => {
    if (!nameInput.trim() || !descInput.trim() || !priceInput.trim()) {
      setFeedbackMessage('Please fill in all required fields.');
      setIsError(true);
      return;
    }

    const price = parseFloat(priceInput);
    if (isNaN(price) || price < 0) {
      setFeedbackMessage('Please enter a valid price.');
      setIsError(true);
      return;
    }

    if (editingId === null) {
      // Create
      const newItem = {
        id: Date.now().toString(),
        name: nameInput,
        description: descInput,
        course: courseInput,
        price: price,
      };
      setMenuItems([...menuItems, newItem]);
      setFeedbackMessage('Menu item added successfully!');
    } else {
      // Update
      setMenuItems(menuItems.map(item => 
        item.id === editingId ? { ...item, name: nameInput, description: descInput, course: courseInput, price: price } : item
      ));
      setFeedbackMessage('Menu item updated successfully!');
      setEditingId(null);
    }

    setIsError(false);
    setNameInput('');
    setDescInput('');
    setPriceInput('');
  };

  const handleEdit = (item) => {
    setNameInput(item.name);
    setDescInput(item.description);
    setCourseInput(item.course);
    setPriceInput(item.price.toString());
    setEditingId(item.id);
    setFeedbackMessage('');
  };

  const handleDelete = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    setFeedbackMessage('Item deleted.');
    setIsError(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chef's Menu Manager</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Statistics Card */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Menu Overview & Statistics</Text>
            <View style={styles.divider} />
            <Text style={styles.statsText}>Total Menu Items: {totalItems}</Text>
            <Text style={styles.statsText}>Average Price: R {averagePrice}</Text>
            <Text style={styles.statsText}>Breakdown -> Starters: {startersCount} | Mains: {mainCount} | Desserts: {dessertCount}</Text>
          </View>

          {/* Form Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{editingId === null ? 'Add New Dish' : 'Edit Existing Dish'}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Dish Name"
              placeholderTextColor="#888"
              value={nameInput}
              onChangeText={setNameInput}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#888"
              value={descInput}
              onChangeText={setDescInput}
            />
            <TextInput
              style={styles.input}
              placeholder="Course (Starter / Main Course / Dessert)"
              placeholderTextColor="#888"
              value={courseInput}
              onChangeText={setCourseInput}
            />
            <TextInput
              style={styles.input}
              placeholder="Price (e.g. 120.0)"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={priceInput}
              onChangeText={setPriceInput}
            />

            {feedbackMessage ? (
              <Text style={[styles.feedback, { color: isError ? '#D32F2F' : '#2E7D32' }]}>
                {feedbackMessage}
              </Text>
            ) : null}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{editingId === null ? 'Add Item' : 'Update Item'}</Text>
              </TouchableOpacity>
              {editingId !== null && (
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    setEditingId(null);
                    setNameInput('');
                    setDescInput('');
                    setPriceInput('');
                    setFeedbackMessage('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Search & Filter Section */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search menu items by name..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {['All', 'Starter', 'Main Course', 'Dessert'].map(filter => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, selectedFilter === filter && styles.selectedChip]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[styles.filterChipText, selectedFilter === filter && styles.selectedChipText]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Menu Items List */}
          {filteredItems.map(item => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>R {item.price.toFixed(2)}</Text>
              </View>
              <Text style={styles.itemDesc}>{item.description}</Text>
              <Text style={styles.itemCategory}>Category: {item.course}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3E8FF' },
  header: { padding: 16, backgroundColor: '#EADDFF', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#21005D' },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  statsCard: { backgroundColor: '#E8DEF8', padding: 16, borderRadius: 12, marginBottom: 16 },
  statsTitle: { fontSize: 16, fontWeight: 'bold', color: '#1D192B' },
  divider: { height: 1, backgroundColor: '#CAC4D0', marginVertical: 8 },
  statsText: { fontSize: 14, color: '#49454F', marginBottom: 4 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#1D192B' },
  input: { borderWidth: 1, borderColor: '#79747E', borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 14, backgroundColor: '#FFFBFE' },
  feedback: { fontSize: 12, marginBottom: 10, fontWeight: '500' },
  buttonRow: { flexDirection: 'row', gap: 8 },
  primaryButton: { flex: 1, backgroundColor: '#6750A4', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  cancelButton: { backgroundColor: '#E7E0EC', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  cancelButtonText: { color: '#1D192B', fontWeight: 'bold', fontSize: 14 },
  searchContainer: {marginBottom: 16 },
  filterRow: { flexDirection: 'row', marginTop: 4 },
  filterChip: { paddingContainer: 12, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#E7E0EC', borderRadius: 16, marginRight: 8 },
  selectedChip: { backgroundColor: '#6750A4' },
  filterChipText: { fontSize: 12, color: '#49454F' },
  selectedChipText: { color: '#FFFFFF' },
  itemCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, elevation: '2' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#1D192B' },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#6750A4' },
  itemDesc: { fontSize: 14, color: '#49454F', marginBottom: 4 },
  itemCategory: { fontSize: 12, fontWeight: '600', color: '#625B71', marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 8 },
  editButton: { borderWidth: 1, borderColor: '#79747E', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
  editButtonText: { color: '#49454F', fontSize: 12, fontWeight: '600' },
  deleteButton: { backgroundColor: '#B3261E', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
  deleteButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
});