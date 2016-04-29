let api = {
  search: function({query, size, page}, callback) {
    $.ajax('/search', {
      type: 'GET',
      dataType: 'json',
      data: {query, size, page},
      success: function(res) {
        if (res) {
          if (callback) callback(res)
          else callback(null)
        } else if (callback) {
          callback(null)
        }
      },
      error: function(res) {
        if (callback) callback(null)
      }
    })
  },
  recommend: function({keywords}, callback) {
    $.ajax('/recommend', {
      type: 'GET',
      dataType: 'json',
      data: {keywords},
      success: function(res) {
        if (res) {
          if (callback) callback(res)
          else callback(null)
        } else if (callback) {
          callback(null)
        }
      },
      error: function(res) {
        if (callback) callback(null)
      }
    })
  }
}

export default api
