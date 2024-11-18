import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

interface PaginationProps {
    page: number;
    setPage: (page: number) => void;
    hasPrevious: boolean;
    hasNext: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ page, setPage, hasPrevious, hasNext }) => {
    return (
        <View style={ styles.pagination }>
            <Button
                title="Previous"
                onPress={ () => setPage(page - 1) }
                disabled={ !hasPrevious }
            />
            <Button
                title="Next"
                onPress={ () => setPage(page + 1) }
                disabled={ !hasNext }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
});

export default Pagination;
