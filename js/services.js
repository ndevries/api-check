angular.module('app.services', [])

.service('PrettyPrint', function() {

    function PrettyPrint(data) {
        data = data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        data = data.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = '';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'text-primary';
                } else {
                    cls = 'text-success';
                }
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
        return data;
    };

});