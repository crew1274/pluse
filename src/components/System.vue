<template>
    <div>
        <el-row :gutter="10">
            
        </el-row>
        <el-row>
            <el-table :data="show_list.filter( data => station.includes(data.device))" style="width: 100%" :row-class-name="tableRowClassName" calss="hello">
                <el-table-column label="開始時間" prop="start_time" />
                <el-table-column label="結束時間" prop="end_time" />
                <el-table-column label="詳細訊息" prop="message" />
                <el-table-column label="來源" prop="device" />
            </el-table>
        </el-row>
    </div>
</template>

<script>
import * as moment from "moment/moment"
 
export default {
    name: "System",
    components:
    {

    },
    props: 
    {

    },
    data()
    {
        return {
            list: [],
            stations: [],
            station: "",
            loading: false,
            date_range: [],
        }
    },
    async created()
    {
        moment.locale("zh-tw")
        this.date_range.push(moment().subtract(1,'d').format('YYYY-MM-DD'))
        this.date_range.push(moment().add(1,'d').format('YYYY-MM-DD'))
        await this.CheckData()
    },
    computed:
    {
        show_list()
        {
            let show_map = {}
            let show_list = []
            this.list.forEach( (element) =>
            {
                if(element["message"] in show_map)
                {
                    show_map[element["message"]]["end_time"] = element["datetime"]
                    show_list.push(show_map[element["message"]])
                    delete show_map[element["message"]]
                }
                else
                {
                    show_map[element["message"]] = element
                    show_map[element["message"]]["start_time"] = element["datetime"]
                }
            })
            Object.keys(show_map).forEach( element =>
            {
                show_map[element]["start_time"] = show_map[element]["datetime"]
                show_map[element]["end_time"] = ""
                show_list.push(show_map[element])
            })
            return show_list.reverse()
        }
    },
    methods:
    {
        finishRefresh()
        {
            this.$emit('finishRefresh')
        },
        async CheckData()
        {
            this.loading = true
            let notes = []
            await fetch("http://10.11.20.108:9999/api/ErrorHandle?start=" + this.date_range[0] + "&end=" + this.date_range[1],
            {
                method: "GET",
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                this.list = response["result"].reverse()
                this._(this.list).forEach( ele =>
                {
                    if(! notes.includes(ele["device"]) )
                    {
                        notes.push(ele["device"])
                    }
                })
                this.stations = []
                let combine = ''
                this._(notes).forEach( ele =>
                {
                    this.stations.push(
                        {
                            value: ele,
                            label: ele
                        }, 
                    )
                    combine = combine + ele + "||"
                })
                this.stations.push(
                    {
                        value: combine,
                        label: "全部"
                    }, 
                ) 
                this.station = combine
            })
            .catch( err =>
            {
                this.$notify.warning({ title: 'Edge資料庫存取異常', message: err})
            })
            .finally( () => {
                this.loading = false
            })
        },
        tableRowClassName({row})
        {
            if (row["end_time"] == "")
            {
                return 'warning-row'
            }
            else
            {
                return ''
            }
        }
    }
}
</script>

<style scoped>
  .el-table >>> .warning-row
  {
    background: #f15c66;
  }
</style>