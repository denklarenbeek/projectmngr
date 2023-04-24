import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { formatCurrency } from '../helpers/formatting';
import moment from 'moment';

// Create styles
const styles = StyleSheet.create({
  page: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  params: {
    fontSize: 12
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  rowText: {
    width: 150,
    fontSize: 12,
    padding: 3
  },
  subtitles: {
    fontSize: 16,
    marginBottom: 16
  },
  header: {
    fontSize: 12,
    marginBottom: 10
  },
  text: {
    fontSize: 12,
    padding: 3,
    width: 120,
    textAlign: 'right'
  },
  table_text: {
    fontSize: 10,
    padding: 2
  }
});

// Create Document Component
export const ProjectPDF = ({title, project, projectBreakdown, projectActivities, totalCosts, totalHours, totalKilometers}) => (
  <Document>
    <Page size="A4" style={styles.page}>
        <Text style={styles.title}>PROJECT: {title}</Text>
        <View style={styles.row}>
            <Text style={styles.params}>Participants: </Text>
            {project.participants.map(participant => <Text style={styles.params}>{participant.name} |  </Text>)}
        </View>
        <Text style={[styles.params, {marginBottom: 20}]}>Started At: {project.started_at}</Text>
        <View style={styles.row}>
            <Text style={styles.rowText}>Total Value</Text>
            <Text style={styles.text}>€ {formatCurrency(project.value)}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.rowText}>Total Hours</Text>
            <Text style={styles.text}>{totalHours}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.rowText}>Total Cost</Text>
            <Text style={styles.text}>€ {formatCurrency(totalCosts)}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.rowText}>Total Kilometer</Text>
            <Text style={styles.text}>{totalKilometers}</Text>
        </View>
        <View style={{borderBottom: 0.5, marginBottom: 20, marginTop: 20}}></View>
        <View>
            <Text style={styles.subtitles}>Project Breakdown</Text>
            <Text style={styles.header} >Participant Split</Text>
            <View style={styles.row}>
                {projectBreakdown.map(participant => {
                    return (
                        <View key={participant.fullname} style={{marginRight: 20, marginBottom: 60}}>
                            <View style={styles.row}>
                                <Text style={[styles.rowText, {fontWeight: 'bold'}]}>Name:</Text>
                                <Text style={[styles.text, {fontWeight: 'bold'}]}>{participant.fullname}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.rowText}>Hours:</Text>
                                <Text style={styles.text}>{participant.totalHours}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.rowText}>Cost:</Text>
                                <Text style={styles.text}>{formatCurrency(participant.totalCosts)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.rowText}>Kilometer Fee: (a € 0,19)</Text>
                                <Text style={styles.text}>{formatCurrency(participant.kmFee)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.rowText}>Project Split</Text>
                                <Text style={styles.text}>{formatCurrency(participant.projectsplit)}</Text>
                            </View>
                            <View style={[styles.row, {borderTop: 0.3}]}>
                                <Text style={styles.rowText}>Total</Text>
                                <Text style={styles.text}>{formatCurrency(participant.totalSplit)}</Text>
                            </View>
                        </View>
                    )
                })}
            </View>
        </View>
    </Page>
    <Page size="A4" style={styles.page}>
        <View>
            <Text style={styles.header}>Activity Log</Text>
            <View>
                <View style={styles.row}>
                    <Text style={[styles.table_text, {width: 120, fontWeight: 'bold'}]}>Participant</Text>
                    <Text style={[styles.table_text, {width: 70, fontWeight: 'bold'}]} >Type</Text>
                    <Text style={[styles.table_text, {width: 70, fontWeight: 'bold'}]} >Quantity</Text>
                    <Text style={[styles.table_text, {width: 70, fontWeight: 'bold'}]} >Start Date</Text>
                    <Text style={[styles.table_text, {width: 70, fontWeight: 'bold'}]} >End Date</Text>
                </View>
                {projectActivities.map(activity => {
                    return (
                        <View key={activity._id} style={styles.row}>
                            <Text style={[styles.table_text, {width: 120}]}>{activity.owner.name}</Text>
                            <Text style={[styles.table_text, {width: 70}]} >{activity.category}</Text>
                            <Text style={[styles.table_text, {width: 70}]} >{activity.quantity}</Text>
                            <Text style={[styles.table_text, {width: 70}]} >{moment(activity.start_date).format('DD-MM-YYYY')}</Text>
                            <Text style={[styles.table_text, {width: 70}]} >{moment(activity.end_date).format('DD-MM-YYYY')}</Text>
                        </View>
                    )
                })}
            </View>
        </View>
    </Page>
  </Document>
);