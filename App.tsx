import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Button,
  Picker,
  TouchableOpacity,
} from "react-native";

const App = () => {
  const [data, setData] = useState([]); // Данные для текущей страницы
  const [filteredData, setFilteredData] = useState([]); // Отфильтрованные данные
  const [page, setPage] = useState(1); // Текущая страница
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
  const [startYear, setStartYear] = useState(""); // Начальный год
  const [endYear, setEndYear] = useState(""); // Конечный год
  const [categories, setCategories] = useState([]); // Все доступные категории
  const [selectedCategories, setSelectedCategories] = useState([]); // Выбранные категории
  const [sortField, setSortField] = useState("title"); // Поле для сортировки
  const [sortDirection, setSortDirection] = useState("asc"); // Направление сортировки

  // Загрузка данных для текущей страницы
  const fetchData = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?page=${page}`);
      const result = await response.json();
      setData(result.data);

      // Сохраняем уникальные категории (если категории еще не загружены)
      if (categories.length === 0) {
        const uniqueCategories = new Set();
        result.data.forEach((item) =>
            item.genres.forEach((genre) => uniqueCategories.add(genre.name))
        );
        setCategories(Array.from(uniqueCategories));
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  // Фильтрация по категориям и годам
  useEffect(() => {
    let filtered = data;

    // Фильтрация по категориям
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
          item.genres.some((genre) => selectedCategories.includes(genre.name))
      );
    }

    // Фильтрация по годам
    if (startYear || endYear) {
      filtered = filtered.filter((item) => {
        const animeYear = item.year || 0;
        const isAfterStartYear = startYear ? animeYear >= parseInt(startYear, 10) : true;
        const isBeforeEndYear = endYear ? animeYear <= parseInt(endYear, 10) : true;
        return isAfterStartYear && isBeforeEndYear;
      });
    }

    setFilteredData(filtered);
  }, [data, selectedCategories, startYear, endYear]);

  // Сортировка
  const sortData = () => {
    return [...filteredData].sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getSortIndicator = (field) => {
    return sortField === field ? (sortDirection === "asc" ? " ▲" : " ▼") : "";
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Anime List (Page {page})</Text>

        {/* Фильтры */}
        <View style={styles.filters}>
          <TextInput
              style={styles.input}
              placeholder="From Year"
              keyboardType="numeric"
              value={startYear}
              onChangeText={(text) => setStartYear(text)}
          />
          <TextInput
              style={styles.input}
              placeholder="To Year"
              keyboardType="numeric"
              value={endYear}
              onChangeText={(text) => setEndYear(text)}
          />
          <Picker
              selectedValue={selectedCategories[0] || ""}
              style={styles.picker}
              onValueChange={(value) => {
                if (value && !selectedCategories.includes(value)) {
                  setSelectedCategories([...selectedCategories, value]);
                }
              }}
          >
            <Picker.Item label="Select Category" value="" />
            {categories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
            ))}
          </Picker>
          <View style={styles.selectedCategories}>
            {selectedCategories.map((category) => (
                <Text key={category} style={styles.category}>
                  {category}
                </Text>
            ))}
            <Button title="Clear" onPress={() => setSelectedCategories([])} />
          </View>
        </View>

        {/* Таблица */}
        {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            <View>
              <FlatList
                  data={sortData()}
                  keyExtractor={(item) => item.mal_id.toString()}
                  ListHeaderComponent={
                    <View style={[styles.row, styles.headerRow]}>
                      <TouchableOpacity
                          style={[styles.cell, styles.columnTitle]} // Стили ширины для TouchableOpacity
                          onPress={() => {
                            setSortField("title");
                            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                          }}
                      >
                        <Text style={[styles.headerCell]}>
                          Title{getSortIndicator("title")}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          style={[styles.cell, styles.columnYear]} // Стили ширины для TouchableOpacity
                          onPress={() => {
                            setSortField("year");
                            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                          }}
                      >
                        <Text style={[styles.headerCell]}>
                          Year{getSortIndicator("year")}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          style={[styles.cell, styles.columnType]} // Стили ширины для TouchableOpacity
                          onPress={() => {
                            setSortField("type");
                            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                          }}
                      >
                        <Text style={[styles.headerCell]}>
                          Type{getSortIndicator("type")}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          style={[styles.cell, styles.columnEpisodes]} // Стили ширины для TouchableOpacity
                          onPress={() => {
                            setSortField("episodes");
                            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                          }}
                      >
                        <Text style={[styles.headerCell]}>
                          Episodes{getSortIndicator("episodes")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  }
                  renderItem={({ item }) => (
                      <View style={styles.row}>
                        <Text style={[styles.cell, styles.columnTitle]}>{item.title}</Text>
                        <Text style={[styles.cell, styles.columnYear]}>{item.year || "Unknown"}</Text>
                        <Text style={[styles.cell, styles.columnType]}>{item.type}</Text>
                        <Text style={[styles.cell, styles.columnEpisodes]}>{item.episodes || "?"}</Text>
                      </View>
                  )}
              />
            </View>
        )}

        {/* Пагинация */}
        <View style={styles.pagination}>
          <Button
              title="Previous"
              onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
          />
          <Button title="Next" onPress={() => setPage((prev) => prev + 1)} />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  filters: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  picker: {
    height: 40,
    marginBottom: 8,
  },
  selectedCategories: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  category: {
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    padding: 4,
    fontSize: 12,
    marginRight: 4,
  },  cell: {
    flex: 1,
    textAlign: "center", // Выравнивание текста в ячейке
    paddingHorizontal: 8, // Отступы по горизонтали
    paddingVertical: 4, // Отступы по вертикали
    minWidth: 80, // Минимальная ширина для равномерного отображения
  },
  headerCell: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    paddingHorizontal: 8, // Добавим отступы
    paddingVertical: 6,
    color: "#0000ff", // Цвет для интерактивности
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center", // Вертикальное выравнивание текста
    justifyContent: "center", // Горизонтальное выравнивание
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  columnTitle: { minWidth: 150, textAlign: "left" },
  columnYear: { minWidth: 100, textAlign: "center" },
  columnType: { minWidth: 120, textAlign: "center" },
  columnEpisodes: { minWidth: 100, textAlign: "center" },
});


export default App;
