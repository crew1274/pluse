<template>
    <div>
        <el-row>
        </el-row>
            <md-button type="primary" @click="ResetPLC" icon="switch">PLC重新連線</md-button>
        <el-row>
        </el-row>
    </div>
</template>

<script>
import { Button, Toast} from "mand-mobile"
export default {
    name: "PLC",
    components: {
        [Button.name]: Button,
    },
    props: {

    },
    data()
    {
        return {

        }
    },
    computed:
    {

    },
    watch:
    {

    },
    methods:
    {
        async ResetPLC()
        {
            this.$store.commit('update_isLoading', true)
            await fetch('http://10.11.20.108:9999/api/reset/plc',{ 
                method: "GET"
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                this.recipe = response["response"]
                Toast.info("重新連線成功")
            })
            .catch( err =>
            {
                Toast.failed(err)
            })
            .finally( () =>
            {
                this.$store.commit('update_isLoading', false)
            })
        },
    }
}
</script>

<style>

</style>